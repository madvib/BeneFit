import {
  WorkoutPerformance,
  DifficultyRating,
} from '@bene/training-core';
import {
  type WorkoutPerformance as SharedWorkoutPerformance,
} from '@bene/shared';

export function toDomainWorkoutPerformance(
  performance: SharedWorkoutPerformance,
): WorkoutPerformance {
  // Shared schema is missing energyLevel, difficultyRating (on workout), injuries, modifications
  // Also activities missing activityType, intervals

  const activities = performance.activities.map((activity) => ({
    activityType: 'main' as const, // Default, as shared schema lacks this
    completed: true, // Implicitly true if reported
    durationMinutes: activity.durationMinutes || 0,
    notes: activity.notes,
    // intervalsCompleted/Planned missing from shared
    exercises: activity.exercises?.map((exercise) => ({
      name: exercise.name,
      setsCompleted: exercise.setsCompleted,
      setsPlanned: exercise.setsPlanned || exercise.setsCompleted, // Default to completed count
      reps: exercise.reps || [],
      weight: exercise.weight || [],
      distance: exercise.distance,
      duration: exercise.duration,
    })),
  }));

  return {
    startedAt: new Date(performance.startedAt),
    completedAt: new Date(performance.completedAt),
    durationMinutes: performance.durationMinutes,
    perceivedExertion: performance.perceivedExertion,
    energyLevel: performance.energyLevel as 'low' | 'medium' | 'high',
    enjoyment: performance.enjoyment,
    difficultyRating: performance.difficultyRating as DifficultyRating,
    activities,
    notes: performance.notes,
    injuries: performance.injuries,
    modifications: performance.modifications,
  };
}
