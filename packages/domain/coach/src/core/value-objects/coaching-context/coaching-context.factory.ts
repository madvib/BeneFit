import { Guard, Result } from '@bene/shared-domain';
import {
  CurrentPlanContext,
  RecentWorkoutSummary,
  PerformanceTrends,
  CoachingContext,
} from './coaching-context.types.js';
import type {
  FitnessGoals,
  TrainingConstraints,
  UserExperienceLevel,
} from '@bene/training-core';

export function createCoachingContext(props: {
  currentPlan?: CurrentPlanContext;
  recentWorkouts: RecentWorkoutSummary[];
  userGoals: FitnessGoals;
  userConstraints: TrainingConstraints;
  experienceLevel: UserExperienceLevel;
  trends: PerformanceTrends;
  daysIntoCurrentWeek: number;
  workoutsThisWeek: number;
  plannedWorkoutsThisWeek: number;
  reportedInjuries?: string[];
  energyLevel: 'low' | 'medium' | 'high';
  stressLevel?: 'low' | 'medium' | 'high';
  sleepQuality?: 'poor' | 'fair' | 'good';
}): Result<CoachingContext> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.recentWorkouts, argumentName: 'recentWorkouts' },
      { argument: props.userGoals, argumentName: 'userGoals' },
      { argument: props.userConstraints, argumentName: 'userConstraints' },
      { argument: props.experienceLevel, argumentName: 'experienceLevel' },
      { argument: props.trends, argumentName: 'trends' },
    ]),

    Guard.againstNegative(props.daysIntoCurrentWeek, 'daysIntoCurrentWeek'),
    Guard.againstNegative(props.workoutsThisWeek, 'workoutsThisWeek'),
    Guard.againstNegative(props.plannedWorkoutsThisWeek, 'plannedWorkoutsThisWeek'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    currentPlan: props.currentPlan,
    recentWorkouts: props.recentWorkouts,
    userGoals: props.userGoals,
    userConstraints: props.userConstraints,
    experienceLevel: props.experienceLevel,
    trends: props.trends,
    daysIntoCurrentWeek: props.daysIntoCurrentWeek,
    workoutsThisWeek: props.workoutsThisWeek,
    plannedWorkoutsThisWeek: props.plannedWorkoutsThisWeek,
    reportedInjuries: props.reportedInjuries || [],
    energyLevel: props.energyLevel,
    stressLevel: props.stressLevel,
    sleepQuality: props.sleepQuality,
  });
}
