import {
  PlanGoals,
  TargetLiftWeight,
} from '@bene/training-core';
import {
  type PlanGoals as SharedPlanGoals,
} from '@bene/shared';

export function toDomainPlanGoals(goals: SharedPlanGoals): PlanGoals {
  return {
    primary: goals.primary,
    secondary: goals.secondary,
    targetMetrics: {
      targetWeights: goals.targetMetrics.targetWeights as
        | readonly TargetLiftWeight[]
        | undefined,
      targetDuration: goals.targetMetrics.targetDuration
        ? {
          activity: goals.targetMetrics.targetDuration.activity,
          duration: goals.targetMetrics.targetDuration.duration,
        }
        : undefined,
      targetPace: goals.targetMetrics.targetPace,
      targetDistance: goals.targetMetrics.targetDistance,
      totalWorkouts: goals.targetMetrics.totalWorkouts,
      minStreakDays: goals.targetMetrics.minStreakDays,
    },
    targetDate: goals.targetDate ? new Date(goals.targetDate) : undefined,
  };
}
