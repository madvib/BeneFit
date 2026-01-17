import { CoachConversation, CoachMsg, CheckIn } from '@bene/coach-domain';
import { coachingConversation } from '../data/schema';

export function toDomain(
  row: typeof coachingConversation.$inferSelect,
  messages: CoachMsg[],
  checkIns: CheckIn[],
): CoachConversation {
  // Deeply rehydrate dates in the context snapshot
  const context = {
    ...row.contextJson,
    userGoals: {
      ...row.contextJson.userGoals,
      targetDate: row.contextJson.userGoals.targetDate
        ? new Date(row.contextJson.userGoals.targetDate)
        : undefined,
    },
    recentWorkouts: row.contextJson.recentWorkouts.map((w) => ({
      ...w,
      date: new Date(w.date),
    })),
  };

  return {
    id: row.id,
    userId: row.userId,
    context: context as CoachConversation['context'],
    messages,
    checkIns,
    totalMessages: row.totalMessages,
    totalUserMessages: row.totalUserMessages,
    totalCoachMessages: row.totalCoachMessages,
    totalCheckIns: row.totalCheckIns,
    pendingCheckIns: row.pendingCheckIns,
    startedAt: row.startedAt,
    lastMessageAt: row.lastMessageAt,
    lastContextUpdateAt: row.lastContextUpdateAt,
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
