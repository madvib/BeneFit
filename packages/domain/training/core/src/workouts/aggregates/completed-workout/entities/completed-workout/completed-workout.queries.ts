import { ReactionType } from '../reaction/reaction.types.js';
import { CompletedWorkout } from './completed-workout.types.js';

/**
 * Query functions for CompletedWorkout
 * 
 * These compute derived properties from the entity.
 * Used by:
 * - Response mappers (to enrich data)
 * - Business logic (to make decisions)
 * - UI components (via API responses)
 */

export function getTotalVolume(workout: CompletedWorkout): number {
  let totalVolume = 0;

  for (const activity of workout.performance.activities) {
    if (activity.exercises) {
      for (const exercise of activity.exercises) {
        if (exercise.weight && exercise.reps) {
          for (let i = 0; i < exercise.setsCompleted; i++) {
            const weight = exercise.weight[i] || 0;
            const reps = exercise.reps[i] || 0;
            totalVolume += weight * reps;
          }
        }
      }
    }
  }

  return totalVolume;
}

export function getCompletionPercentage(workout: CompletedWorkout): number {
  let totalPlanned = 0;
  let totalCompleted = 0;

  for (const activity of workout.performance.activities) {
    if (activity.exercises) {
      for (const exercise of activity.exercises) {
        totalPlanned += exercise.setsPlanned;
        totalCompleted += exercise.setsCompleted;
      }
    }
  }

  return totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 100;
}

export function wasWorkoutHard(workout: CompletedWorkout): boolean {
  return workout.performance.perceivedExertion >= 8;
}

export function wasWorkoutEnjoyable(workout: CompletedWorkout): boolean {
  return workout.performance.enjoyment >= 4;
}

export function getTotalSets(workout: CompletedWorkout): number {
  return workout.performance.activities.reduce((total, activity) => {
    if (!activity.exercises) return total;
    return total + activity.exercises.reduce((sum, ex) => sum + ex.setsCompleted, 0);
  }, 0);
}

export function getTotalExercises(workout: CompletedWorkout): number {
  return workout.performance.activities.reduce((total, activity) => {
    return total + (activity.exercises?.length ?? 0);
  }, 0);
}

export function getCompletionRate(workout: CompletedWorkout): number {
  const activities = workout.performance.activities;
  if (activities.length === 0) return 0;

  const completedCount = activities.filter(a => a.completed).length;
  return completedCount / activities.length;
}

export function getSetCompletionRate(workout: CompletedWorkout): number {
  let totalPlanned = 0;
  let totalCompleted = 0;

  workout.performance.activities.forEach(activity => {
    activity.exercises?.forEach(exercise => {
      totalPlanned += exercise.setsPlanned;
      totalCompleted += exercise.setsCompleted;
    });
  });

  return totalPlanned > 0 ? totalCompleted / totalPlanned : 0;
}

export function hasHeartRateData(workout: CompletedWorkout): boolean {
  return !!workout.performance.heartRate;
}

export function isFromPlan(workout: CompletedWorkout): boolean {
  return !!workout.planId;
}

export function isMultiplayer(workout: CompletedWorkout): boolean {
  return !!workout.multiplayerSessionId;
}

export function getReactionCount(workout: CompletedWorkout): number {
  return workout.reactions.length;
}

export function getReactionsByType(
  workout: CompletedWorkout,
): Record<ReactionType, number> {
  const counts: Record<ReactionType, number> = {
    fire: 0,
    strong: 0,
    clap: 0,
    heart: 0,
    smile: 0,
  };

  for (const reaction of workout.reactions) {
    counts[reaction.type as ReactionType] = (counts[reaction.type as ReactionType] || 0) + 1;
  }

  return counts;
}

export function hasUserReacted(workout: CompletedWorkout, userId: string): boolean {
  return workout.reactions.some((r) => r.userId === userId);
}
