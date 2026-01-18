import { randomUUID } from 'crypto';
import { Guard, Result } from '@bene/shared';
import { createDefaultSessionConfig, SessionConfiguration, WorkoutActivity } from '../../value-objects/index.js';
import { WorkoutSession, WorkoutSessionView } from './workout-session.types.js';
import * as Queries from './workout-session.queries.js';

export interface CreateWorkoutSessionParams {
  ownerId: string;
  workoutType: string;
  activities: WorkoutActivity[];
  isMultiplayer?: boolean;
  configuration?: Partial<SessionConfiguration>;

  // Optional plan reference
  planId?: string;
  workoutTemplateId?: string;
}

export function createWorkoutSession(
  params: CreateWorkoutSessionParams,
): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: params.ownerId, argumentName: 'ownerId' },
      { argument: params.workoutType, argumentName: 'workoutType' },
      { argument: params.activities, argumentName: 'activities' },
    ]),

    Guard.againstEmptyString(params.ownerId, 'ownerId'),
    Guard.againstEmptyString(params.workoutType, 'workoutType'),
    Guard.isTrue(params.activities.length > 0, 'activities cannot be empty'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  const isMultiplayer = params.isMultiplayer ?? false;
  const config = {
    ...createDefaultSessionConfig(isMultiplayer),
    ...params.configuration,
  };
  const now = new Date();

  return Result.ok({
    id: randomUUID(),
    ownerId: params.ownerId,
    planId: params.planId,
    workoutTemplateId: params.workoutTemplateId,
    workoutType: params.workoutType,
    activities: params.activities,
    state: 'preparing',
    currentActivityIndex: 0,
    completedActivities: [],
    configuration: config,
    participants: [],
    activityFeed: [],
    totalPausedSeconds: 0,
    createdAt: now,
    updatedAt: now,
  });
}

// ============================================
// CONVERSION (Entity → API View)
// ============================================

export function toWorkoutSessionView(session: WorkoutSession): WorkoutSessionView {
  return {
    ...session,
    startedAt: session.startedAt?.toISOString(),
    pausedAt: session.pausedAt?.toISOString(),
    resumedAt: session.resumedAt?.toISOString(),
    completedAt: session.completedAt?.toISOString(),
    abandonedAt: session.abandonedAt?.toISOString(),
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),

    // Computed fields
    activeDuration: Queries.getActiveDuration(session),
    completionPercentage: Queries.getCompletionPercentage(session),

    liveProgress: session.liveProgress
      ? {
        ...session.liveProgress,
        activityStartedAt: session.liveProgress.activityStartedAt.toISOString(),
      }
      : undefined,

    participants: session.participants.map((p) => ({
      ...p,
      joinedAt: p.joinedAt.toISOString(),
      leftAt: p.leftAt?.toISOString(),
    })),

    activityFeed: session.activityFeed.map((f) => ({
      ...f,
      timestamp: f.timestamp.toISOString(),
    })),
  };
}
