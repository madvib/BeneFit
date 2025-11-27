// This file just exports the types and functions for WorkoutGoals
// The implementation is separated into factory and commands files
export type { CompletionCriteria, DistanceGoal, DurationGoal, VolumeGoal, WorkoutGoals } from './workout-goals.types.js';
export { createWorkoutGoals, createDistanceWorkout, createVolumeWorkout, createDurationWorkout } from './workout-goals.factory.js';
export * as WorkoutGoalsCommands from './workout-goals.commands.js';
