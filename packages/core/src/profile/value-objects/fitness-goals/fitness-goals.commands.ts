import { Guard, Result } from '@shared';
import { PrimaryFitnessGoal, TargetWeight, FitnessGoals } from './fitness-goals.types.js';

// Update functions
export function updatePrimaryGoal(goals: FitnessGoals, primary: PrimaryFitnessGoal): FitnessGoals {
  return {
    ...goals,
    primary,
  };
}

export function updateMotivation(goals: FitnessGoals, motivation: string): Result<FitnessGoals> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(motivation, 'motivation'),
    Guard.againstTooLong(motivation, 500, 'motivation'),
  ]);
  
  if (guardResult && guardResult.isFailure) return Result.fail(guardResult.error);
  
  return Result.ok({
    ...goals,
    motivation,
  });
}

export function addSecondaryGoal(goals: FitnessGoals, secondaryGoal: string): FitnessGoals {
  const guardResult = Guard.againstEmptyString(secondaryGoal, 'secondaryGoal');
  if (guardResult && guardResult.isFailure) return goals; // Return unchanged if invalid

  // Prevent duplicates
  if (goals.secondary.includes(secondaryGoal)) {
    return goals;
  }

  return {
    ...goals,
    secondary: [...goals.secondary, secondaryGoal],
  };
}

export function removeSecondaryGoal(goals: FitnessGoals, secondaryGoal: string): FitnessGoals {
  return {
    ...goals,
    secondary: goals.secondary.filter(goal => goal !== secondaryGoal),
  };
}

export function updateTargetWeight(goals: FitnessGoals, targetWeight: TargetWeight): Result<FitnessGoals> {
  const guardResult = Guard.combine([
    Guard.againstNegativeOrZero(targetWeight.current, 'targetWeight.current'),
    Guard.againstNegativeOrZero(targetWeight.target, 'targetWeight.target'),
  ]);
  
  if (guardResult && guardResult.isFailure) return Result.fail(guardResult.error);
  
  return Result.ok({
    ...goals,
    targetWeight,
  });
}

export function updateTargetBodyFat(goals: FitnessGoals, targetBodyFat: number): Result<FitnessGoals> {
  const guardResult = Guard.inRange(targetBodyFat, 3, 50, 'targetBodyFat');
  if (guardResult && guardResult.isFailure) return Result.fail(guardResult.error);
  
  return Result.ok({
    ...goals,
    targetBodyFat,
  });
}

export function updateTargetDate(goals: FitnessGoals, targetDate: Date): Result<FitnessGoals> {
  const guardResult = Guard.isTrue(targetDate > new Date(), 'targetDate must be in the future');
  if (guardResult && guardResult.isFailure) return Result.fail(guardResult.error);
  
  return Result.ok({
    ...goals,
    targetDate,
  });
}

export function addTargetSuccessCriterion(goals: FitnessGoals, criterion: string): FitnessGoals {
  const guardResult = Guard.againstEmptyString(criterion, 'criterion');
  if (guardResult && guardResult.isFailure) return goals; // Return unchanged if invalid

  // Prevent duplicates
  if (goals.successCriteria.includes(criterion)) {
    return goals;
  }

  return {
    ...goals,
    successCriteria: [...goals.successCriteria, criterion],
  };
}

export function removeTargetSuccessCriterion(goals: FitnessGoals, criterion: string): FitnessGoals {
  return {
    ...goals,
    successCriteria: goals.successCriteria.filter(c => c !== criterion),
  };
}

// Query functions
export function getPrimaryGoal(goals: FitnessGoals): PrimaryFitnessGoal {
  return goals.primary;
}

export function getMotivation(goals: FitnessGoals): string {
  return goals.motivation;
}

export function getSecondaryGoals(goals: FitnessGoals): string[] {
  return [...goals.secondary];
}

export function hasTargetWeight(goals: FitnessGoals): boolean {
  return goals.targetWeight !== undefined;
}

export function hasTargetBodyFat(goals: FitnessGoals): boolean {
  return goals.targetBodyFat !== undefined;
}

export function hasTargetDate(goals: FitnessGoals): boolean {
  return goals.targetDate !== undefined;
}

export function getTargetWeight(goals: FitnessGoals): TargetWeight | undefined {
  return goals.targetWeight;
}

export function getTargetBodyFat(goals: FitnessGoals): number | undefined {
  return goals.targetBodyFat;
}

export function getTargetDate(goals: FitnessGoals): Date | undefined {
  return goals.targetDate;
}

export function getSuccessCriteria(goals: FitnessGoals): string[] {
  return [...goals.successCriteria];
}

export function hasSpecificTargets(goals: FitnessGoals): boolean {
  return hasTargetWeight(goals) || hasTargetBodyFat(goals) || hasTargetDate(goals);
}

export function isWeightRelatedGoal(goals: FitnessGoals): boolean {
  return ['weight_loss', 'weight_gain'].includes(goals.primary);
}

export function isStrengthRelatedGoal(goals: FitnessGoals): boolean {
  return ['strength', 'hypertrophy'].includes(goals.primary);
}

export function isEnduranceRelatedGoal(goals: FitnessGoals): boolean {
  return ['endurance', 'sport_specific'].includes(goals.primary);
}

// Assessment functions
export function isGoalAchievable(goals: FitnessGoals, currentDate: Date = new Date()): boolean {
  if (goals.targetDate && currentDate > goals.targetDate) {
    // If the target date has passed, evaluate if it's achievable
    // This would depend on progress made, but for now return true
    return true;
  }
  return true; // Assume goals are achievable by default
}

export function getGoalUrgency(goals: FitnessGoals): 'low' | 'medium' | 'high' | 'critical' {
  if (!goals.targetDate) {
    return 'medium'; // No deadline, medium urgency
  }

  const timeDiff = goals.targetDate.getTime() - new Date().getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysUntil <= 0) return 'critical';
  if (daysUntil <= 7) return 'high';
  if (daysUntil <= 30) return 'medium';
  return 'low';
}

// Comparison functions
export function equals(goals: FitnessGoals, other: FitnessGoals): boolean {
  if (!other) return false;

  return (
    goals.primary === other.primary &&
    JSON.stringify(goals.secondary) === JSON.stringify(other.secondary) &&
    JSON.stringify(goals.targetWeight) === JSON.stringify(other.targetWeight) &&
    goals.targetBodyFat === other.targetBodyFat &&
    goals.targetDate?.getTime() === other.targetDate?.getTime() &&
    goals.motivation === other.motivation &&
    JSON.stringify(goals.successCriteria) === JSON.stringify(other.successCriteria)
  );
}