import { CheckIn, CoachMsg } from '../../value-objects/index.js';
import { CoachConversation } from './index.js';

export function getRecentMessages(
  conversation: CoachConversation,
  count: number = 10,
): CoachMsg[] {
  return conversation.messages.slice(-count);
}

export function getLatestMessage(
  conversation: CoachConversation,
): CoachMsg | undefined {
  return conversation.messages[conversation.messages.length - 1];
}


export function getPendingCheckIns(conversation: CoachConversation): CheckIn[] {
  return conversation.checkIns.filter((c) => c.status === 'pending');
}

export function getCheckInById(
  conversation: CoachConversation,
  checkInId: string,
): CheckIn | undefined {
  return conversation.checkIns.find((c) => c.id === checkInId);
}

export function hasRecentActivity(
  conversation: CoachConversation,
  hoursThreshold: number = 24,
): boolean {
  const threshold = Date.now() - hoursThreshold * 60 * 60 * 1000;
  return conversation.lastMessageAt.getTime() > threshold;
}

export function shouldSendCheckIn(conversation: CoachConversation): boolean {
  if (conversation.pendingCheckIns > 0) {
    return false;
  }

  const context = conversation.context;

  if (context.currentPlan && context.currentPlan.adherenceRate < 0.5) {
    return true;
  }

  if (context.reportedInjuries && context.reportedInjuries.length > 0) {
    return true;
  }

  if (context.trends.enjoymentTrend === 'declining') {
    return true;
  }

  const recentHighExertion = context.recentWorkouts
    .slice(-3)
    .filter((w) => w.perceivedExertion >= 9);
  if (recentHighExertion.length >= 2) {
    return true;
  }

  const progress = context.workoutsThisWeek / context.plannedWorkoutsThisWeek;
  if (context.daysIntoCurrentWeek >= 4 && progress < 0.5) {
    return true;
  }

  return false;
}

export function getConversationSummary(conversation: CoachConversation): {
  messageCount: number;
  userMessageCount: number;
  coachMessageCount: number;
  checkInCount: number;
  pendingCheckInCount: number;
  daysSinceStart: number;
  daysSinceLastMessage: number;
} {
  const now = Date.now();
  const daysSinceStart = Math.floor(
    (now - conversation.startedAt.getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysSinceLastMessage = Math.floor(
    (now - conversation.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    messageCount: conversation.totalMessages,
    userMessageCount: conversation.totalUserMessages,
    coachMessageCount: conversation.totalCoachMessages,
    checkInCount: conversation.totalCheckIns,
    pendingCheckInCount: conversation.pendingCheckIns,
    daysSinceStart,
    daysSinceLastMessage,
  };
}

export function getTotalActionsApplied(conversation: CoachConversation): number {
  let total = 0;

  for (const message of conversation.messages) {
    if (message.actions) {
      total += message.actions.length;
    }
  }

  for (const checkIn of conversation.checkIns) {
    total += checkIn.actions.length;
  }

  return total;
}

export function getActionsByType(
  conversation: CoachConversation,
): Record<string, number> {
  const counts: Record<string, number> = {
    adjusted_plan: 0,
    suggested_rest_day: 0,
    encouraged: 0,
    scheduled_followup: 0,
    recommended_deload: 0,
    modified_exercise: 0,
    celebrated_win: 0,
  };

  for (const message of conversation.messages) {
    if (message.actions) {
      for (const action of message.actions) {
        const type = action.type;
        counts[type] = (counts[type] || 0) + 1;
      }
    }
  }

  for (const checkIn of conversation.checkIns) {
    for (const action of checkIn.actions) {
      const type = action.type;
      counts[type] = (counts[type] || 0) + 1;
    }
  }

  return counts;
}
