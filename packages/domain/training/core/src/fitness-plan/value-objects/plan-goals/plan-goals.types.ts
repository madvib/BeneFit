import { SerializeDates } from '@bene/shared';

export interface TargetLiftWeight {
  readonly exercise: string;
  readonly weight: number; // kg or lbs
}

export interface TargetDuration {
  readonly activity: string;
  readonly duration: number; // minutes
}

export interface TargetMetrics {
  readonly targetWeights?: readonly TargetLiftWeight[];
  readonly targetDuration?: TargetDuration;
  readonly targetPace?: number; // seconds per km/mile
  readonly targetDistance?: number; // meters for running/cycling goals
  readonly totalWorkouts?: number; // for consistency goals
  readonly minStreakDays?: number; // for habit building
}

export interface PlanGoals {
  readonly primary: string;
  readonly secondary: readonly string[];
  readonly targetMetrics: TargetMetrics;
  readonly targetDate?: Date;
}

export type PlanGoalsView = SerializeDates<PlanGoals>;
