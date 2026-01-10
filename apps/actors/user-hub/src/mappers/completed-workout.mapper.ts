import {
  NewCompletedWorkout,
  CompletedWorkout as DbCompletedWorkout,
} from '../data/schema';
import {
  CompletedWorkout,
  WorkoutPerformance,
  WorkoutVerification,
  VerificationData,
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
    performanceJson: workout.performance,
    verificationJson: workout.verification,

    // Social
    isPublic: workout.isPublic,
    multiplayerSessionId: workout.multiplayerSessionId || null,

    createdAt: workout.createdAt,
  };
}

// Database to Domain
export function toDomain(row: DbCompletedWorkout): CompletedWorkout {
  const performance = (row.performanceJson as WorkoutPerformance) || {};
  const verification = (row.verificationJson as WorkoutVerification) || {};

  // Helper to ensure we have a Date object, falling back to recordedAt/completedAt if missing
  const parseDate = (val: unknown, fallback: Date) => {
    if (!val) return fallback;
    const d = new Date(val as string | number | Date);
    return isNaN(d.getTime()) ? fallback : d;
  };

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
    performance: {
      ...performance,
      startedAt: parseDate(performance.startedAt, row.recordedAt),
      completedAt: parseDate(performance.completedAt, row.completedAt),
    },

    // Verification (from JSON)
    verification: {
      ...verification,
      verifiedAt: verification.verifiedAt ? new Date(verification.verifiedAt) : undefined,
      verifications: (verification.verifications || []).map((v: VerificationData) => ({
        ...v,
        data: v.data ? Object.fromEntries(
          Object.entries(v.data).map(([k, val]) => {
            if (k.toLowerCase().includes('time') || k.toLowerCase().includes('at') || k === 'timestamp') {
              return [k, val ? new Date(val as string | number | Date) : val];
            }
            return [k, val];
          })
        ) : v.data
      }))
    },

    // Social (reactions loaded separately, not from this row)
    reactions: [],
    isPublic: row.isPublic || false,
    multiplayerSessionId: row.multiplayerSessionId || undefined,

    // Metadata
    createdAt: row.createdAt!,
    recordedAt: row.recordedAt,
  };
}
