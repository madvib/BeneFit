import {
  FitnessGoals,
  PrimaryFitnessGoal,
} from '@bene/training-core';
import {
  type FitnessGoals as SharedFitnessGoals,
} from '@bene/shared';

export function toDomainFitnessGoals(
  fitnessGoals: SharedFitnessGoals,
): FitnessGoals {
  return {
    primary: fitnessGoals.primary as PrimaryFitnessGoal,
    secondary: fitnessGoals.secondary,
    targetWeight: fitnessGoals.targetWeight
      ? {
        current: fitnessGoals.targetWeight.current,
        target: fitnessGoals.targetWeight.target,
        unit: fitnessGoals.targetWeight.unit as 'kg' | 'lbs',
      }
      : undefined,
    targetBodyFat: fitnessGoals.targetBodyFat,
    targetDate: fitnessGoals.targetDate
      ? new Date(fitnessGoals.targetDate)
      : undefined,
    motivation: fitnessGoals.motivation,
    successCriteria: fitnessGoals.successCriteria,
  };
}
