import { CoachingConversationRepository } from '@bene/application/coach';
import { CoachingConversation } from '@bene/core/coach';
import { Result } from '@bene/shared-domain';
import { eq } from 'drizzle-orm';

export class D1CoachingConversationRepository
  implements CoachingConversationRepository
{
  constructor(private db: DbClient) {}

  async findByUserId(userId: string): Promise<Result<CoachingConversation>> {
    try {
      const row = await this.db
        .select()
        .from(coachingConversations)
        .where(eq(coachingConversations.userId, userId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(`Coaching conversation for user ${userId} not found`);
      }

      const conversation = this.toDomain(row[0]);
      return Result.ok(conversation);
    } catch (error) {
      return Result.fail(`Failed to find coaching conversation: ${error}`);
    }
  }

  async save(conversation: CoachingConversation): Promise<Result<void>> {
    try {
      const row = this.toDatabase(conversation);

      // Upsert
      await this.db.insert(coachingConversations).values(row).onConflictDoUpdate({
        target: coachingConversations.id,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to save coaching conversation: ${error}`);
    }
  }

  async saveSnapshot(conversation: CoachingConversation): Promise<Result<void>> {
    try {
      // For now, this is identical to save, but could have different logic for snapshots
      return this.save(conversation);
    } catch (error) {
      return Result.fail(`Failed to save coaching conversation snapshot: ${error}`);
    }
  }

  // MAPPERS

  private toDomain(
    row: typeof coachingConversations.$inferSelect,
  ): CoachingConversation {
    return {
      id: row.id,
      userId: row.userId,
      context: row.contextSnapshot as any, // Placeholder for actual context type
      messages: row.messagesSnapshot as any, // Placeholder for actual messages type
      checkIns: row.checkInsSnapshot as any, // Placeholder for actual check-ins type
      stats: {
        totalMessages: row.totalMessages,
        totalCheckIns: row.totalCheckIns,
        pendingCheckIns: row.pendingCheckIns,
      },
      startedAt: row.startedAt,
      lastMessageAt: row.lastMessageAt,
      lastSnapshotAt: row.lastSnapshotAt,
    };
  }

  private toDatabase(
    conversation: CoachingConversation,
  ): typeof coachingConversations.$inferInsert {
    return {
      id: conversation.id,
      userId: conversation.userId,
      contextSnapshot: conversation.context as any,
      messagesSnapshot: conversation.messages as any,
      checkInsSnapshot: conversation.checkIns as any,
      totalMessages: conversation.stats.totalMessages,
      totalCheckIns: conversation.stats.totalCheckIns,
      pendingCheckIns: conversation.stats.pendingCheckIns,
      startedAt: conversation.startedAt,
      lastMessageAt: conversation.lastMessageAt,
      lastSnapshotAt: conversation.lastSnapshotAt,
    };
  }
}
