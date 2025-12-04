// workout-plan.factory.ts
import { Result, Guard } from '@bene/shared-domain';
import { PlanType, WorkoutPlan } from './workout-plan.types.js';
import { TrainingConstraints } from '@/shared/index.js';
import {
  createPlanPosition,
  PlanGoals,
  ProgressionStrategy,
} from '@/fitness-plan/value-objects/index.js';

interface CreateDraftParams {
  id: string;
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  goals: PlanGoals;
  progression: ProgressionStrategy;
  constraints: TrainingConstraints;
  startDate: string;
}

/**
 * FACTORY: Creates a new WorkoutPlan in 'draft' status.
 */
export function createDraftWorkoutPlan(params: CreateDraftParams): Result<WorkoutPlan> {
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

  const data: WorkoutPlan = {
    id: params.id,
    userId: params.userId,
    title: params.title,
    description: params.description,
    planType: params.planType,
    goals: params.goals,
    progression: params.progression,
    constraints: params.constraints,
    weeks: [],
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
export function workoutPlanFromPersistence(data: WorkoutPlan): Result<WorkoutPlan> {
  return Result.ok(data);
}
