// Export all parts of the CompletedWorkout entity
export type { CompletedWorkout } from './completed-workout.types.js';
export { createCompletedWorkout } from './completed-workout.factory.js';
export * as CompletedWorkoutCommands from './completed-workout.commands.js';
export * as CompletedWorkoutQueries from './completed-workout.queries.js';
export * from './completed-workout.presentation.js';
export * from './test/completed-workout.fixtures.js';
