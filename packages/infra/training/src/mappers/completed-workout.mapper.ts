import {
  NewCompletedWorkout,
  CompletedWorkout as DbCompletedWorkout,
} from '@bene/persistence';
import {
  CompletedWorkout,
  WorkoutPerformance,
  WorkoutVerification,
} from '@bene/training-core';

// Helper to extract fields from performance for querying/indexing
function extractPerformanceMetrics(performance: WorkoutPerformance) {
  const totalVolume = performance.activities
    .flatMap((a) => a.exercises || [])
    .reduce((sum, ex) => {
      const sets = ex.weight?.map((w, i) => w * (ex.reps?.[i] || 0)) || [];
      return sum + sets.reduce((a, b) => a + b, 0);
    }, 0);

  const distanceMeters = performance.activities
    .flatMap((a) => a.exercises || [])
    .reduce((sum, ex) => sum + (ex.distance ? ex.distance * 1000 : 0), 0);

  const durationSeconds = performance.durationMinutes * 60;

  return {
    totalVolume: totalVolume > 0 ? totalVolume : null,
    distanceMeters: distanceMeters > 0 ? distanceMeters : null,
    caloriesBurned: performance.caloriesBurned || null,
    durationSeconds,
    feelingRating: performance.enjoyment || null,
    perceivedExertion: performance.perceivedExertion,
    difficultyRating: performance.difficultyRating,
    notes: performance.notes || null,
  };
}

// Domain to Database
export function toDatabase(workout: CompletedWorkout): NewCompletedWorkout {
  const metrics = extractPerformanceMetrics(workout.performance);

  return {
    id: workout.id,
    userId: workout.userId,
    workoutId: workout.workoutTemplateId,
    // Plan references
    planId: workout.planId || null,
    workoutTemplateId: workout.workoutTemplateId || null,
    weekNumber: workout.weekNumber || null,
    dayNumber: workout.dayNumber || null,

    // Core metadata
    workoutType: workout.workoutType,
    description: workout.description || null,

    // Timing
    completedAt: workout.performance.completedAt,
    recordedAt: workout.recordedAt,
    durationSeconds: metrics.durationSeconds,

    // Extracted subjective metrics
    feelingRating: metrics.feelingRating,
    percceivedExertion: metrics.perceivedExertion,
    difficultyRating: metrics.difficultyRating,
    notes: metrics.notes,

    // Extracted calculated metrics
    totalVolume: metrics.totalVolume,
    distanceMeters: metrics.distanceMeters,
    caloriesBurned: metrics.caloriesBurned,

    // Full workout data as JSON (source of truth)
    performanceJson: workout.performance as any,
    verificationJson: workout.verification as any,

    // Social
    isPublic: workout.isPublic,
    multiplayerSessionId: workout.multiplayerSessionId || null,

    createdAt: workout.createdAt,
  };
}

// Database to Domain
export function toDomain(row: DbCompletedWorkout): CompletedWorkout {
  return {
    id: row.id,
    userId: row.userId,

    // Plan references
    planId: row.planId || undefined,
    workoutTemplateId: row.workoutTemplateId || undefined,
    weekNumber: row.weekNumber || undefined,
    dayNumber: row.dayNumber || undefined,

    // Core metadata
    workoutType: row.workoutType,
    description: row.description || undefined,

    // Performance data (from JSON - source of truth)
    performance: row.performanceJson as WorkoutPerformance,

    // Verification (from JSON)
    verification: row.verificationJson as WorkoutVerification,

    // Social (reactions loaded separately, not from this row)
    reactions: [],
    isPublic: row.isPublic || false,
    multiplayerSessionId: row.multiplayerSessionId || undefined,

    // Metadata
    createdAt: row.createdAt!,
    recordedAt: row.recordedAt,
  };
}
