// workout-plan.factory.ts
import { Result, Guard } from '@bene/shared';
import { PlanType, FitnessPlan } from './fitness-plan.types.js';
import { TrainingConstraints } from '@/shared/index.js';
import {
  createPlanPosition,
  PlanGoals,
  ProgressionStrategy,
} from '@/fitness-plan/value-objects/index.js';
import { randomUUID } from 'crypto';

import { WeeklySchedule } from '../weekly-schedule/index.js';

interface CreateDraftParams {
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  goals: PlanGoals;
  progression: ProgressionStrategy;
  constraints: TrainingConstraints;
  startDate: string;
  weeks?: WeeklySchedule[];
}

/**
 * FACTORY: Creates a new WorkoutPlan in 'draft' status.
 */
export function createDraftFitnessPlan(params: CreateDraftParams): Result<FitnessPlan> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(params.title, 'title'),
    Guard.againstEmptyString(params.userId, 'userId'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const initialPositionResult = createPlanPosition({ week: 1, day: 0 });
  if (initialPositionResult.isFailure) {
    return Result.fail(initialPositionResult.error);
  }

  const now = new Date();

  const data: FitnessPlan = {
    id: randomUUID(),
    userId: params.userId,
    title: params.title,
    description: params.description,
    planType: params.planType,
    goals: params.goals,
    progression: params.progression,
    constraints: params.constraints,
    weeks: params.weeks || [],
    status: 'draft',
    currentPosition: initialPositionResult.value,
    startDate: params.startDate,
    createdAt: now,
    updatedAt: now,
  };

  return Result.ok(data);
}

/**
 * FACTORY: Rehydrates the WorkoutPlan from persistence.
 */
export function workoutPlanFromPersistence(data: FitnessPlan): Result<FitnessPlan> {
  return Result.ok(data);
}
