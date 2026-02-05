import { type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { eq, and, notInArray } from 'drizzle-orm';
import { Result, EntityNotFoundError, QueryError, SaveError } from '@bene/shared';
import type { CoachConversation, CoachConversationRepository } from '@bene/coach-domain';
import {
  toDomain,
  toDatabase,
  toMessageDomain,
  toCheckInDomain,
  toMessageDatabase,
  toCheckInDatabase,
} from '../mappers/coach-conversation.mapper.js';
import {
  coach_schema,
  coachingConversation,
  coachingMessages,
  checkIns,
} from '../data/schema/index.js';

export class DurableCoachConversationRepository implements CoachConversationRepository {
  constructor(private db: DrizzleSqliteDODatabase<typeof coach_schema>) {}

  async findById(id: string): Promise<Result<CoachConversation>> {
    try {
      // Fetch the conversation
      const [convRow] = await this.db
        .select()
        .from(coachingConversation)
        .where(eq(coachingConversation.id, id))
        .limit(1);

      if (!convRow) {
        return Result.fail(new EntityNotFoundError('CoachConversation', id));
      }

      // Fetch related messages
      const msgRows = await this.db
        .select()
        .from(coachingMessages)
        .where(eq(coachingMessages.conversationId, id));

      // Fetch related check-ins
      const ciRows = await this.db.select().from(checkIns).where(eq(checkIns.conversationId, id));

      const messages = msgRows.map(toMessageDomain);
      const checkInList = ciRows.map(toCheckInDomain);

      const conversation = toDomain(convRow, messages, checkInList);
      return Result.ok(conversation);
    } catch (error) {
      return Result.fail(
        new QueryError('find', 'CoachConversation', error instanceof Error ? error : undefined),
      );
    }
  }

  async findByUserId(userId: string): Promise<Result<CoachConversation>> {
    try {
      // Fetch the conversation
      const [convRow] = await this.db
        .select()
        .from(coachingConversation)
        .where(eq(coachingConversation.userId, userId))
        .limit(1);

      if (!convRow) {
        return Result.fail(new EntityNotFoundError('CoachConversation', userId));
      }

      // Fetch related messages
      const msgRows = await this.db
        .select()
        .from(coachingMessages)
        .where(eq(coachingMessages.conversationId, convRow.id));

      // Fetch related check-ins
      const ciRows = await this.db
        .select()
        .from(checkIns)
        .where(eq(checkIns.conversationId, convRow.id));

      const messages = msgRows.map(toMessageDomain);
      const checkInList = ciRows.map(toCheckInDomain);

      const conversation = toDomain(convRow, messages, checkInList);
      return Result.ok(conversation);
    } catch (error) {
      return Result.fail(
        new QueryError('find', 'CoachConversation', error instanceof Error ? error : undefined),
      );
    }
  }

  async save(conversation: CoachConversation): Promise<Result<void>> {
    try {
      const row = toDatabase(conversation);

      // Save main conversation
      await this.db.insert(coachingConversation).values(row).onConflictDoUpdate({
        target: coachingConversation.id,
        set: row,
      });

      // Sync messages
      const currentMsgIds = conversation.messages.map((m) => m.id);
      if (currentMsgIds.length > 0) {
        await this.db
          .delete(coachingMessages)
          .where(
            and(
              eq(coachingMessages.conversationId, conversation.id),
              notInArray(coachingMessages.id, currentMsgIds),
            ),
          );
      } else {
        await this.db
          .delete(coachingMessages)
          .where(eq(coachingMessages.conversationId, conversation.id));
      }

      if (conversation.messages.length > 0) {
        const msgRows = conversation.messages.map((m) => toMessageDatabase(conversation.id, m));
        for (const msgRow of msgRows) {
          const { id: msgId, ...msgUpdate } = msgRow;
          await this.db.insert(coachingMessages).values(msgRow).onConflictDoUpdate({
            target: coachingMessages.id,
            set: msgUpdate,
          });
        }
      }

      // Sync check-ins
      const currentCheckInIds = conversation.checkIns.map((ci) => ci.id);
      if (currentCheckInIds.length > 0) {
        await this.db
          .delete(checkIns)
          .where(
            and(
              eq(checkIns.conversationId, conversation.id),
              notInArray(checkIns.id, currentCheckInIds),
            ),
          );
      } else {
        await this.db.delete(checkIns).where(eq(checkIns.conversationId, conversation.id));
      }

      if (conversation.checkIns.length > 0) {
        const ciRows = conversation.checkIns.map((ci) => toCheckInDatabase(conversation.id, ci));
        for (const ciRow of ciRows) {
          const { id: ciId, ...ciUpdate } = ciRow;
          await this.db.insert(checkIns).values(ciRow).onConflictDoUpdate({
            target: checkIns.id,
            set: ciUpdate,
          });
        }
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'CoachConversation',
          conversation.id,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async saveSnapshot(conversation: CoachConversation): Promise<Result<void>> {
    try {
      return this.save(conversation);
    } catch (error) {
      return Result.fail(
        new SaveError(
          'CoachConversation snapshot',
          conversation.id,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}
