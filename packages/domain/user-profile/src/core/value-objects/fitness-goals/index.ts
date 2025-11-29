// This file just exports the types and functions for FitnessGoals
// The implementation is separated into factory and commands files
export type { FitnessGoals, PrimaryFitnessGoal, TargetWeight } from './fitness-goals.types.js';
export { createFitnessGoals } from './fitness-goals.factory.js';
export * as FitnessGoalsCommands from './fitness-goals.commands.js';
