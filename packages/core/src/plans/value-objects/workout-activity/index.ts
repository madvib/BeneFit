// This file just exports the types and functions for WorkoutActivity
// The implementation is separated into factory and commands files
export type { ActivityType, WorkoutActivity, WorkoutActivityValidation } from './workout-activity.types.js';
export { createWorkoutActivity } from './workout-activity.factory.js';
export * as WorkoutActivityCommands from './workout-activity.commands.js';
