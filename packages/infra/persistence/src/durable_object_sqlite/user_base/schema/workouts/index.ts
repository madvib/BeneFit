import { completedWorkouts } from './completed_workouts.ts';
import { workoutActivities, workoutActivitiesRelations } from './workout_activities.ts';
import { workoutMetadata } from './workout_metadata.ts';
import { workoutReactions, workoutReactionsRelations } from './workout_reactions.ts';

export * from './completed_workouts.ts';
export * from './workout_activities.ts';
export * from './workout_metadata.ts';
export * from './workout_reactions.ts';

export const workoutsSchema = {
  completedWorkouts,
  workoutActivities,
  workoutActivitiesRelations,
  workoutMetadata,
  workoutReactions,
  workoutReactionsRelations,
};
