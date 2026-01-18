import { randomUUID } from 'crypto';
import { Guard, Result } from '@bene/shared';
import {
  WorkoutPerformance,
  WorkoutType,
  WorkoutVerification, toWorkoutPerformanceView, toWorkoutVerificationView
} from '@/workouts/value-objects/index.js';
import { toReactionView } from '../reaction/reaction.factory.js';
import { CompletedWorkout, CompletedWorkoutView } from './completed-workout.types.js';
import * as Queries from './completed-workout.queries.js';
export interface CreateCompletedWorkoutParams {
  userId: string;
  workoutType: WorkoutType;
  title?: string;
  description?: string;
  performance: WorkoutPerformance;
  verification: WorkoutVerification;
  isPublic?: boolean;

  // Optional plan reference
  planId?: string;
  workoutTemplateId?: string;
  weekNumber?: number;
  dayNumber?: number;

  // Optional multiplayer reference
  multiplayerSessionId?: string;
}

export function createCompletedWorkout(
  params: CreateCompletedWorkoutParams,
): Result<CompletedWorkout> {
  const guards = [
    Guard.againstNullOrUndefinedBulk([
      { argument: params.userId, argumentName: 'userId' },
      { argument: params.workoutType, argumentName: 'workoutType' },
      { argument: params.performance, argumentName: 'performance' },
      { argument: params.verification, argumentName: 'verification' },
    ]),
    Guard.againstEmptyString(params.userId, 'userId'),
    Guard.againstEmptyString(params.workoutType, 'workoutType'),
  ];

  if (params.title) {
    guards.push(Guard.againstEmptyString(params.title, 'title'));
  }
  if (params.description) {
    guards.push(Guard.againstTooLong(params.description, 500, 'description'));
  }
  // If plan reference provided, validate it
  if (params.planId) {
    guards.push(Guard.againstEmptyString(params.planId, 'planId'));
  }
  if (params.workoutTemplateId) {
    guards.push(
      Guard.againstEmptyString(params.workoutTemplateId, 'workoutTemplateId'),
    );
  }
  if (params.weekNumber !== undefined) {
    guards.push(Guard.againstNegativeOrZero(params.weekNumber, 'weekNumber'));
  }
  if (params.dayNumber !== undefined) {
    guards.push(Guard.againstNegative(params.dayNumber, 'dayNumber'));
  }

  const guardResult = Guard.combine(guards);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  const now = new Date();

  return Result.ok({
    id: randomUUID(),
    userId: params.userId,
    planId: params.planId,
    workoutTemplateId: params.workoutTemplateId,
    weekNumber: params.weekNumber,
    dayNumber: params.dayNumber,
    workoutType: params.workoutType,
    title: params.title ?? params.workoutType,
    description: params.description,
    performance: params.performance,
    verification: params.verification,
    reactions: [],
    isPublic: params.isPublic ?? false,
    multiplayerSessionId: params.multiplayerSessionId,
    createdAt: now,
    recordedAt: params.performance.completedAt,
  });
}

// ============================================
// CONVERSION (Entity → API View)
// ============================================

export function toCompletedWorkoutView(
  entity: CompletedWorkout,
): CompletedWorkoutView {
  const performanceView = toWorkoutPerformanceView(entity.performance);
  const verificationView = toWorkoutVerificationView(entity.verification);

  return {
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    recordedAt: entity.recordedAt.toISOString(),
    performance: {
      ...performanceView,
      totalVolume: Queries.getTotalVolume(entity),
      totalSets: Queries.getTotalSets(entity),
      totalExercises: Queries.getTotalExercises(entity),
      completionRate: Queries.getCompletionRate(entity),
    },
    verification: verificationView,
    reactions: entity.reactions.map(toReactionView),
    isVerified: entity.verification.verified,
    reactionCount: Queries.getReactionCount(entity),
  };
}
