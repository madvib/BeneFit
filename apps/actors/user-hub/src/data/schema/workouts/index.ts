import { completedWorkouts } from './completed_workouts';
import { workoutActivities, workoutActivitiesRelations } from './workout_activities';
import { workoutMetadata } from './workout_metadata';
import { workoutReactions, workoutReactionsRelations } from './workout_reactions';

export * from './completed_workouts';
export * from './workout_activities';
export * from './workout_metadata';
export * from './workout_reactions';

export const workouts_schema = {
  completedWorkouts,
  workoutActivities,
  workoutActivitiesRelations,
  workoutMetadata,
  workoutReactions,
  workoutReactionsRelations,
};
