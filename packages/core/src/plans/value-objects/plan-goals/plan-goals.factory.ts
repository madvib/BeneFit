import { Result, Guard } from '@shared';
import { GoalsValidationError } from '../../errors/workout-plan-errors.js';
import { PlanGoals, TargetMetrics, TargetWeight } from './plan-goals.types.js';

export interface PlanGoalsProps {
  readonly primary: string;
  readonly secondary: readonly string[];
  readonly targetMetrics: TargetMetrics;
  readonly targetDate?: Date;
}

export function createPlanGoals(props: PlanGoalsProps): Result<PlanGoals> {
  // Validate primary goal
  const guardResult = Guard.againstEmptyString(props.primary, 'primary goal');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  // Validate secondary goals (no empty strings)
  for (const goal of props.secondary) {
    const secondaryGuard = Guard.againstEmptyString(goal, 'secondary goal');
    if (secondaryGuard.isFailure) {
      return Result.fail(secondaryGuard.error);
    }
  }

  // Validate target date is in the future (if provided)
  if (props.targetDate && props.targetDate <= new Date()) {
    return Result.fail(new GoalsValidationError('Target date must be in the future', { targetDate: props.targetDate }));
  }

  // Validate target metrics
  if (props.targetMetrics.targetPace !== undefined && props.targetMetrics.targetPace <= 0) {
    return Result.fail(new GoalsValidationError('Target pace must be positive', { targetPace: props.targetMetrics.targetPace }));
  }

  if (props.targetMetrics.targetDistance !== undefined && props.targetMetrics.targetDistance <= 0) {
    return Result.fail(new GoalsValidationError('Target distance must be positive', { targetDistance: props.targetMetrics.targetDistance }));
  }

  if (props.targetMetrics.totalWorkouts !== undefined && props.targetMetrics.totalWorkouts <= 0) {
    return Result.fail(new GoalsValidationError('Total workouts must be positive', { totalWorkouts: props.targetMetrics.totalWorkouts }));
  }

  if (props.targetMetrics.minStreakDays !== undefined && props.targetMetrics.minStreakDays <= 0) {
    return Result.fail(new GoalsValidationError('Minimum streak days must be positive', { minStreakDays: props.targetMetrics.minStreakDays }));
  }

  // Validate target weights
  if (props.targetMetrics.targetWeights) {
    for (const weight of props.targetMetrics.targetWeights) {
      const weightGuard = Guard.combine([
        Guard.againstEmptyString(weight.exercise, 'exercise name'),
        Guard.againstNegativeOrZero(weight.weight, 'weight'),
      ]);
      if (weightGuard.isFailure) {
        return Result.fail(weightGuard.error);
      }
    }
  }

  return Result.ok(props);
}

// Factory methods for common goal types
export function createEventTraining(
  eventName: string,
  distance: number, // meters
  targetDate: Date,
  targetPace: number // seconds per km or mile
): Result<PlanGoals> {
  return createPlanGoals({
    primary: `${eventName} Training`,
    secondary: [`Run ${distance / 1000}km`, `Run at pace of ${Math.floor(targetPace / 60)}:${targetPace % 60}/km`],
    targetMetrics: {
      targetDistance: distance,
      targetPace,
    },
    targetDate,
  });
}

export function createStrengthBuilding(
  primary: string,
  targetWeights: TargetWeight[],
  targetDate?: Date
): Result<PlanGoals> {
  return createPlanGoals({
    primary,
    secondary: targetWeights.map(w => `Lift ${w.weight}kg in ${w.exercise}`),
    targetMetrics: {
      targetWeights,
    },
    targetDate,
  });
}

export function createHabitBuilding(
  habit: string,
  minStreakDays: number,
  targetDate?: Date
): Result<PlanGoals> {
  return createPlanGoals({
    primary: `${habit} Habit Building`,
    secondary: [`Maintain ${habit} for at least ${minStreakDays} days in a row`],
    targetMetrics: {
      minStreakDays,
    },
    targetDate,
  });
}