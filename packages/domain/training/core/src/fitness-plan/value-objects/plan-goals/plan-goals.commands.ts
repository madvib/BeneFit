import { Result, Guard } from '@bene/shared';
import { GoalsValidationError } from '../../errors/fitness-plan-errors.js';
import { PlanGoals, TargetMetrics, TargetLiftWeight } from './plan-goals.types.js';

// Getters would be direct property access

// Query methods
export function hasTargetDate(goals: PlanGoals): boolean {
  return goals.targetDate !== undefined;
}

export function hasTargetWeights(goals: PlanGoals): boolean {
  return (
    goals.targetMetrics.targetWeights !== undefined &&
    goals.targetMetrics.targetWeights.length > 0
  );
}

export function hasTargetPace(goals: PlanGoals): boolean {
  return goals.targetMetrics.targetPace !== undefined;
}

export function hasTargetDistance(goals: PlanGoals): boolean {
  return goals.targetMetrics.targetDistance !== undefined;
}

export function hasTargetWorkouts(goals: PlanGoals): boolean {
  return goals.targetMetrics.totalWorkouts !== undefined;
}

export function hasTargetStreak(goals: PlanGoals): boolean {
  return goals.targetMetrics.minStreakDays !== undefined;
}

export function isEventTraining(goals: PlanGoals): boolean {
  return hasTargetDistance(goals) && hasTargetPace(goals);
}

export function isStrengthFocused(goals: PlanGoals): boolean {
  return hasTargetWeights(goals);
}

export function isConsistencyFocused(goals: PlanGoals): boolean {
  return hasTargetWorkouts(goals) || hasTargetStreak(goals);
}

// Date calculations
export function daysUntilTarget(goals: PlanGoals): number | null {
  if (!goals.targetDate) {
    return null;
  }
  const now = new Date();
  const target = new Date(goals.targetDate);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function weeksUntilTarget(goals: PlanGoals): number | null {
  const days = daysUntilTarget(goals);
  return days !== null ? Math.ceil(days / 7) : null;
}

// Exercise queries
export function getTargetWeightForExercise(
  goals: PlanGoals,
  exercise: string,
): number | null {
  if (!goals.targetMetrics.targetWeights) {
    return null;
  }

  const targetWeight = goals.targetMetrics.targetWeights.find(
    (w) => w.exercise.toLowerCase() === exercise.toLowerCase(),
  );
  return targetWeight ? targetWeight.weight : null;
}

export function getAllTargetExercises(goals: PlanGoals): string[] {
  if (!goals.targetMetrics.targetWeights) {
    return [];
  }
  return goals.targetMetrics.targetWeights.map((w) => w.exercise);
}

// Transformation functions (immutable)
export function withNewTargetDate(goals: PlanGoals, newDate: Date): Result<PlanGoals> {
  if (newDate <= new Date()) {
    return Result.fail(
      new GoalsValidationError('Target date must be in the future', { newDate }),
    );
  }

  return Result.ok({
    ...goals,
    targetDate: newDate,
  });
}

export function withExtendedTargetDate(
  goals: PlanGoals,
  additionalWeeks: number,
): Result<PlanGoals> {
  if (!goals.targetDate) {
    return Result.fail(
      new GoalsValidationError('Cannot extend target date: no current target date', {
        additionalWeeks,
      }),
    );
  }

  const newDate = new Date(goals.targetDate);
  newDate.setDate(newDate.getDate() + additionalWeeks * 7);

  return Result.ok({
    ...goals,
    targetDate: newDate,
  });
}

export function withUpdatedPrimaryGoal(
  goals: PlanGoals,
  newPrimary: string,
): Result<PlanGoals> {
  const guardResult = Guard.againstEmptyString(newPrimary, 'primary goal');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...goals,
    primary: newPrimary,
  });
}

export function withAdditionalSecondaryGoal(
  goals: PlanGoals,
  newSecondary: string,
): Result<PlanGoals> {
  const guardResult = Guard.againstEmptyString(newSecondary, 'secondary goal');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const newSecondaryGoals = new Set([...goals.secondary, newSecondary]);
  const updatedSecondary = Array.from(newSecondaryGoals);

  return Result.ok({
    ...goals,
    secondary: updatedSecondary,
  });
}

export function withUpdatedTargetPace(
  goals: PlanGoals,
  newPace: number,
): Result<PlanGoals> {
  if (newPace <= 0) {
    return Result.fail(
      new GoalsValidationError('Target pace must be positive', { newPace }),
    );
  }

  return Result.ok({
    ...goals,
    targetMetrics: {
      ...goals.targetMetrics,
      targetPace: newPace,
    },
  });
}

export function withUpdatedTargetWeight(
  goals: PlanGoals,
  exercise: string,
  newWeight: number,
): Result<PlanGoals> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(exercise, 'exercise name'),
    Guard.againstNegativeOrZero(newWeight, 'weight'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  let updatedWeights: TargetLiftWeight[];
  if (goals.targetMetrics.targetWeights) {
    // Find if exercise already exists and update it
    const existingIndex = goals.targetMetrics.targetWeights.findIndex(
      (w) => w.exercise.toLowerCase() === exercise.toLowerCase(),
    );
    if (existingIndex !== -1) {
      updatedWeights = [...goals.targetMetrics.targetWeights];
      updatedWeights[existingIndex] = { exercise, weight: newWeight };
    } else {
      // Add new weight target
      updatedWeights = [
        ...goals.targetMetrics.targetWeights,
        { exercise, weight: newWeight },
      ];
    }
  } else {
    // Create new array with single target
    updatedWeights = [{ exercise, weight: newWeight }];
  }

  return Result.ok({
    ...goals,
    targetMetrics: {
      ...goals.targetMetrics,
      targetWeights: updatedWeights,
    },
  });
}

export function withAdjustedTargetMetrics(
  goals: PlanGoals,
  factor: number,
): Result<PlanGoals> {
  if (factor <= 0 || factor > 1.5) {
    return Result.fail(
      new GoalsValidationError('Adjustment factor must be between 0 and 1.5', {
        factor,
      }),
    );
  }

  const newMetrics: TargetMetrics = {
    ...goals.targetMetrics,
    targetDistance:
      goals.targetMetrics.targetDistance !== undefined
        ? Math.round(goals.targetMetrics.targetDistance * factor)
        : undefined,
    targetPace:
      goals.targetMetrics.targetPace !== undefined
        ? Math.round(goals.targetMetrics.targetPace / factor)
        : undefined,
    targetWeights: goals.targetMetrics.targetWeights
      ? goals.targetMetrics.targetWeights.map((weight) => ({
          ...weight,
          weight: Math.round(weight.weight * factor * 10) / 10,
        }))
      : undefined,
    totalWorkouts:
      goals.targetMetrics.totalWorkouts !== undefined
        ? Math.round(goals.targetMetrics.totalWorkouts * factor)
        : undefined,
    minStreakDays:
      goals.targetMetrics.minStreakDays !== undefined
        ? Math.round(goals.targetMetrics.minStreakDays * factor)
        : undefined,
  };

  return Result.ok({
    ...goals,
    targetMetrics: newMetrics,
  });
}

// Display helpers
export function getPrimaryGoalDescription(goals: PlanGoals): string {
  return goals.primary;
}

export function getFullDescription(goals: PlanGoals): string {
  const parts: string[] = [goals.primary];

  if (goals.targetDate) {
    parts.push(`Target: ${goals.targetDate.toDateString()}`);
  }

  if (goals.targetMetrics.targetDistance) {
    parts.push(`Distance: ${goals.targetMetrics.targetDistance / 1000}km`);
  }

  if (goals.targetMetrics.targetPace) {
    const minutes = Math.floor(goals.targetMetrics.targetPace / 60);
    const seconds = goals.targetMetrics.targetPace % 60;
    parts.push(`Pace: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}/km`);
  }

  return parts.join(' | ');
}

export function getMetricsSummary(goals: PlanGoals): string {
  const metrics: string[] = [];

  if (goals.targetMetrics.targetDistance) {
    metrics.push(`${goals.targetMetrics.targetDistance / 1000}km`);
  }

  if (goals.targetMetrics.targetPace) {
    const minutes = Math.floor(goals.targetMetrics.targetPace / 60);
    const seconds = goals.targetMetrics.targetPace % 60;
    metrics.push(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}/km pace`);
  }

  if (goals.targetMetrics.totalWorkouts) {
    metrics.push(`${goals.targetMetrics.totalWorkouts} workouts`);
  }

  if (goals.targetMetrics.minStreakDays) {
    metrics.push(`${goals.targetMetrics.minStreakDays} day streak`);
  }

  if (
    goals.targetMetrics.targetWeights &&
    goals.targetMetrics.targetWeights.length > 0
  ) {
    metrics.push(`${goals.targetMetrics.targetWeights.length} strength targets`);
  }

  return metrics.length > 0 ? metrics.join(', ') : 'No specific metrics';
}

// Equality
export function equals(goals: PlanGoals, other: PlanGoals): boolean {
  if (!other) return false;

  return (
    goals.primary === other.primary &&
    JSON.stringify(goals.secondary) === JSON.stringify(other.secondary) &&
    JSON.stringify(goals.targetMetrics) === JSON.stringify(other.targetMetrics) &&
    goals.targetDate?.getTime() === other.targetDate?.getTime()
  );
}
