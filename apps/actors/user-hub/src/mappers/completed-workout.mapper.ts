import type {
  NewDbCompletedWorkout,
  DbCompletedWorkout,
} from '../data/schema';
import { CompletedWorkout, CompletedWorkoutSchema } from '@bene/training-core';

// Domain to Database
export function toDatabase(workout: CompletedWorkout): NewDbCompletedWorkout {
  // Extract dates from performance to store as columns
  const { startedAt, completedAt, ...performanceData } = workout.performance;

  return {
    id: workout.id,
    userId: workout.userId,
    workoutId: workout.workoutTemplateId,
    // Plan references
    planId: workout.planId ?? null,
    workoutTemplateId: workout.workoutTemplateId ?? null,
    weekNumber: workout.weekNumber ?? null,
    dayNumber: workout.dayNumber ?? null,

    // Core metadata
    workoutType: workout.workoutType,
    title: workout.title,
    description: workout.description ?? null,

    // Timing - dates extracted from performance
    startedAt,
    completedAt,
    recordedAt: workout.recordedAt,
    durationSeconds: Math.round(workout.performance.durationMinutes * 60),

    // Extracted subjective metrics
    feelingRating: workout.performance.enjoyment ?? null,
    percceivedExertion: workout.performance.perceivedExertion,
    difficultyRating: workout.performance.difficultyRating,
    notes: workout.performance.notes ?? null,

    // Extracted calculated metrics (allow null since they're computed)
    totalVolume: null,
    distanceMeters: null,
    caloriesBurned: workout.performance.caloriesBurned ?? null,

    // Performance data as JSON (no dates - stored as columns)
    performanceJson: performanceData,
    verificationJson: workout.verification,

    // Social
    isPublic: workout.isPublic,
    multiplayerSessionId: workout.multiplayerSessionId ?? null,

    createdAt: workout.createdAt,
  };
}

// Database to Domain
export function toDomain(row: DbCompletedWorkout): CompletedWorkout {
  const data = {
    id: row.id,
    userId: row.userId,

    // Plan references
    planId: row.planId ?? undefined,
    workoutTemplateId: row.workoutTemplateId ?? undefined,
    weekNumber: row.weekNumber ?? undefined,
    dayNumber: row.dayNumber ?? undefined,

    // Core metadata
    workoutType: row.workoutType,
    title: row.title,
    description: row.description ?? undefined,

    // Performance data - merge dates back in from columns
    performance: {
      ...row.performanceJson,
      startedAt: row.startedAt,
      completedAt: row.completedAt,
    },

    // Verification (from JSON)
    verification: row.verificationJson,

    // Social (reactions loaded separately, not from this row)
    reactions: [],
    isPublic: row.isPublic ?? false,
    multiplayerSessionId: row.multiplayerSessionId ?? undefined,

    // Metadata
    createdAt: row.createdAt,
    recordedAt: row.recordedAt,
  };

  return CompletedWorkoutSchema.parse(data);
}
