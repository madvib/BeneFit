import { Guard, Result } from '@shared';
import { createDefaultSessionConfig } from '../../value-objects/session-configuration/session-configuration.factory.js';
import { SessionConfiguration } from '../../value-objects/session-configuration/session-configuration.js';
import { WorkoutActivity } from '../../value-objects/workout-activity/workout-activity.types.js';
import { WorkoutSession } from './workout-session.js';

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
    id: crypto.randomUUID(),
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
