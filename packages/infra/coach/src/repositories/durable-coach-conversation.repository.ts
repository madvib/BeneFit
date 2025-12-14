import { eq } from 'drizzle-orm';
import { Result } from '@bene/shared-domain';
import type {
  CoachConversation,
  CoachConversationRepository,
} from '@bene/coach-domain';
import type { coach_schema, DOClient } from '@bene/persistence';
import { coachingConversation } from '@bene/persistence';
import { toDomain, toDatabase } from '../mappers/coach-conversation.mapper.js';
import { EntityNotFoundError, QueryError, SaveError } from '@bene/shared-infra';

export class DurableCoachConversationRepository implements CoachConversationRepository {
  constructor(private db: DOClient<typeof coach_schema>) { }
  findById(id: string): Promise<Result<CoachConversation>> {
    throw new Error('Method not implemented.');
  }

  async findByUserId(userId: string): Promise<Result<CoachConversation>> {
    try {
      const row = await this.db
        .select()
        .from(coachingConversation)
        .where(eq(coachingConversation.userId, userId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(new EntityNotFoundError('CoachConversation', userId));
      }

      const conversation = toDomain(row[0]!);
      return Result.ok(conversation);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find',
          'CoachConversation',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async save(conversation: CoachConversation): Promise<Result<void>> {
    try {
      const row = toDatabase(conversation);

      await this.db.insert(coachingConversation).values(row).onConflictDoUpdate({
        target: coachingConversation.id,
        set: row,
      });

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
      // For now, this is identical to save, but could have different logic for snapshots
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
