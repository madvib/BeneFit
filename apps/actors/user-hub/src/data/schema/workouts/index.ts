import { completedWorkouts } from './completed_workouts.js';
import { workoutActivities, workoutActivitiesRelations } from './workout_activities.js';
import { workoutMetadata } from './workout_metadata.js';
import { workoutReactions, workoutReactionsRelations } from './workout_reactions.js';

export * from './completed_workouts.js';
export * from './workout_activities.js';
export * from './workout_metadata.js';
export * from './workout_reactions.js';

export const workouts_schema = {
  completedWorkouts,
  workoutActivities,
  workoutActivitiesRelations,
  workoutMetadata,
  workoutReactions,
  workoutReactionsRelations,
};
