// This file just exports the types and functions for TrainingConstraints
// The implementation is separated into factory and commands files
export type { Injury, InjurySeverity, PreferredTime, TrainingConstraints, TrainingLocation } from './training-constraints.types.js';
export { createGymTrainingConstraints, createTrainingConstraints, createInjuryConstraints, createHomeTrainingConstraints } from './training-constraints.factory.js';
export * as TrainingConstraintsCommands from './training-constraints.commands.js';
