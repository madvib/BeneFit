// This file just exports the types and functions for PlanGoals
// The implementation is separated into factory and commands files
export type {
  PlanGoals,
  TargetDuration,
  TargetMetrics,
  TargetLiftWeight,
} from './plan-goals.types.js';
export {
  createPlanGoals,
  createEventTraining,
  createHabitBuilding,
  createStrengthBuilding,
} from './plan-goals.factory.js';
export * as PlanGoalsCommands from './plan-goals.commands.js';
export * from './plan-goals.presentation.js';
export * from './test/plan-goals.fixtures.js';