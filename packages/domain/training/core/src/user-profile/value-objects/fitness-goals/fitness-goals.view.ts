import { FitnessGoals, FitnessGoalsView } from './fitness-goals.types.js';

export function toFitnessGoalsView(goals: FitnessGoals): FitnessGoalsView {
  return {
    ...goals,
    targetWeight: goals.targetWeight ? { ...goals.targetWeight } : undefined,
    targetDate: goals.targetDate?.toISOString(),
    secondary: [...goals.secondary],
    successCriteria: [...goals.successCriteria],
  };
}
