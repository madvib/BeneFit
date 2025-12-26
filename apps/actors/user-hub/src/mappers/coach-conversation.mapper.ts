import { CoachConversation } from '@bene/coach-domain';
import { coachingConversation } from '../data/schema';
export function toDomain(
  row: typeof coachingConversation.$inferSelect,
): CoachConversation {
  return {
    id: row.id,
    userId: row.userId,
    context: row.contextJson as any,
    messages: [], // Messages are stored in a separate table
    checkIns: [], // Check-ins are stored in a separate table
    totalMessages: row.totalMessages ?? 0,
    totalUserMessages: row.totalUserMessages ?? 0,
    totalCoachMessages: row.totalCoachMessages ?? 0,
    totalCheckIns: row.totalCheckIns ?? 0,
    pendingCheckIns: row.pendingCheckIns ?? 0,
    startedAt: row.startedAt ?? new Date(),
    lastMessageAt: row.lastMessageAt ?? new Date(),
    lastContextUpdateAt: row.lastContextUpdateAt ?? new Date(),
  };
}

export function toDatabase(
  conversation: CoachConversation,
): typeof coachingConversation.$inferInsert {
  return {
    id: conversation.id,
    userId: conversation.userId,
    contextJson: conversation.context,
    totalMessages: conversation.totalMessages,
    totalUserMessages: conversation.totalUserMessages,
    totalCoachMessages: conversation.totalCoachMessages,
    totalCheckIns: conversation.totalCheckIns,
    pendingCheckIns: conversation.pendingCheckIns,
    startedAt: conversation.startedAt,
    lastMessageAt: conversation.lastMessageAt,
    lastContextUpdateAt: conversation.lastContextUpdateAt,
  };
}
