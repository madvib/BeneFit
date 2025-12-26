import { Result, Guard } from '@bene/shared';
import {
  CoachContext,
  CoachConversation,
  CoachMsg,
  createCoachContext,
  createCoachMessage,
} from '../../index.js';
import type { FitnessGoals, TrainingConstraints } from '@bene/training-core';
import { randomUUID } from 'crypto';
export interface CreateCoachConversationParams {
  userId: string;
  context?: CoachContext;
  initialMessage?: string;
}

export function createCoachConversation(
  params: CreateCoachConversationParams,
): Result<CoachConversation> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(params.userId, 'userId'),
    Guard.againstNullOrUndefined(params.userId, 'userId'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  // Check if context is explicitly null (should fail), but allow undefined (use default)
  if (params.context === null) {
    return Result.fail(new Error('Context cannot be null'));
  }

  const now = new Date();
  const initialContext = params.context || createDefaultCoachContext().value;

  // Create initial message if provided
  let initialMessages: CoachMsg[] = [];
  let initialTotalCoachMessages = 0;
  if (params.initialMessage) {
    const messageResult = createCoachMessage(
      params.initialMessage,
      [],
      undefined,
      undefined,
    );
    if (messageResult.isSuccess) {
      initialMessages = [messageResult.value];
      initialTotalCoachMessages = 1;
    }
  }

  const conversation: CoachConversation = {
    id: randomUUID(),
    userId: params.userId,
    context: initialContext,
    messages: initialMessages,
    checkIns: [],
    totalMessages: params.initialMessage ? 1 : 0,
    totalUserMessages: 0,
    totalCoachMessages: initialTotalCoachMessages,
    totalCheckIns: 0,
    pendingCheckIns: 0,
    startedAt: now,
    lastMessageAt: now,
    lastContextUpdateAt: now,
  };

  return Result.ok(conversation);
}

function createDefaultCoachContext() {
  // Create default fitness goals
  const defaultGoals: FitnessGoals = {
    primary: 'strength',
    secondary: [],
    motivation: 'General fitness improvement',
    successCriteria: [],
  };

  // Create default training constraints
  const defaultConstraints: TrainingConstraints = {
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableEquipment: ['bodyweight'],
    location: 'home' as const,
  };

  // Create default performance trends
  const defaultTrends = {
    volumeTrend: 'stable' as const,
    adherenceTrend: 'stable' as const,
    energyTrend: 'medium' as const,
    exertionTrend: 'stable' as const,
    enjoymentTrend: 'stable' as const,
  };

  // Create default recent workouts
  const defaultRecentWorkouts: [] = [];

  return createCoachContext({
    recentWorkouts: defaultRecentWorkouts,
    userGoals: defaultGoals,
    userConstraints: defaultConstraints,
    experienceLevel: 'beginner' as const,
    trends: defaultTrends,
    daysIntoCurrentWeek: 0,
    workoutsThisWeek: 0,
    plannedWorkoutsThisWeek: 0,
    energyLevel: 'medium' as const,
  });
}
