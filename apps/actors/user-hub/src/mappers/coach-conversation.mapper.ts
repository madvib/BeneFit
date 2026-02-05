import { CoachConversation, CoachMsg, CheckIn } from '@bene/coach-domain';
import { coachingConversation, coachingMessages, checkIns } from '../data/schema';

export function toMessageDomain(
  row: typeof coachingMessages.$inferSelect,
): CoachMsg {
  return {
    id: row.id,
    role: row.role === 'assistant' ? 'coach' : 'user',
    content: row.content,
    timestamp: row.createdAt,
    actions: row.contextJson?.actions || [],
    checkInId: row.contextJson?.checkInId,
  } as CoachMsg;
}

export function toCheckInDomain(
  row: typeof checkIns.$inferSelect,
): CheckIn {
  return {
    id: row.id,
    type: row.type as CheckIn['type'],
    triggeredBy: row.triggeredBy || undefined,
    question: row.question,
    userResponse: row.userResponse || undefined,
    coachAnalysis: row.coachAnalysis || undefined,
    actions: row.actionsJson || [],
    status: row.status as CheckIn['status'],
    createdAt: row.createdAt,
    respondedAt: row.respondedAt || undefined,
    dismissedAt: row.dismissedAt || undefined,
  } as CheckIn;
}

export function toDomain(
  row: typeof coachingConversation.$inferSelect,
  messages: CoachMsg[] = [],
  checkIns: CheckIn[] = [],
): CoachConversation {
  // Deeply rehydrate dates in the context snapshot
  const context = {
    ...row.contextJson,
    userGoals: row.contextJson?.userGoals ? {
      ...row.contextJson.userGoals,
      targetDate: row.contextJson.userGoals.targetDate
        ? new Date(row.contextJson.userGoals.targetDate)
        : undefined,
    } : undefined,
    recentWorkouts: (row.contextJson?.recentWorkouts || []).map((w) => ({
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
  } as CoachConversation;
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

export function toMessageDatabase(
  conversationId: string,
  msg: CoachMsg,
): typeof coachingMessages.$inferInsert {
  return {
    id: msg.id,
    conversationId,
    role: msg.role === 'coach' ? 'assistant' : 'user',
    content: msg.content,
    contextJson: {
      actions: msg.actions,
      checkInId: msg.checkInId,
      tokens: msg.tokens,
    },
    createdAt: msg.timestamp,
  };
}

export function toCheckInDatabase(
  conversationId: string,
  ci: CheckIn,
): typeof checkIns.$inferInsert {
  return {
    id: ci.id,
    conversationId,
    type: ci.type,
    triggeredBy: ci.triggeredBy,
    question: ci.question,
    userResponse: ci.userResponse,
    coachAnalysis: ci.coachAnalysis,
    actionsJson: ci.actions,
    status: ci.status,
    createdAt: ci.createdAt,
    respondedAt: ci.respondedAt,
    dismissedAt: ci.dismissedAt,
  };
}
