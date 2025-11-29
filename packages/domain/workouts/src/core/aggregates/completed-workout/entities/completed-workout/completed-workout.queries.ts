import { ReactionType } from '../reaction/reaction.types.js';
import { CompletedWorkout } from './completed-workout.types.js';

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
    counts[reaction.type]++;
  }

  return counts;
}

export function hasUserReacted(workout: CompletedWorkout, userId: string): boolean {
  return workout.reactions.some((r) => r.userId === userId);
}
