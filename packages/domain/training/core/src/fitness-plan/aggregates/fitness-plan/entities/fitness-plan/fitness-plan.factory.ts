// workout-plan.factory.ts
import { randomUUID } from 'crypto';
import { Result, Guard } from '@bene/shared';
import { PlanType, FitnessPlan, FitnessPlanView } from './fitness-plan.types.js';
import { TrainingConstraints } from '@/shared/index.js';
import {
  createPlanPosition,
  PlanGoals,
  ProgressionStrategy,
  toPlanGoalsView,
} from '@/fitness-plan/value-objects/index.js';

import { WeeklySchedule } from '../weekly-schedule/index.js';
import { toWeeklyScheduleView } from '../weekly-schedule/weekly-schedule.factory.js';
import { toWorkoutTemplateView } from '../workout-template/workout-template.factory.js';
import * as Queries from './fitness-plan.queries.js';

interface CreateDraftParams {
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  goals: PlanGoals;
  progression: ProgressionStrategy;
  constraints: TrainingConstraints;
  startDate: Date;
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

// ============================================
// CONVERSION (Entity → API View)
// ============================================

/**
 * Map FitnessPlan entity to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Enriches with computed fields (currentWorkout, currentWeek, summary)
 * - Omits internal fields (templateId)
 */
export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  const currentWorkout = Queries.getCurrentWorkout(plan);
  const currentWeek = Queries.getCurrentWeek(plan);
  const summary = Queries.getWorkoutSummary(plan);

  return {
    // Entity fields (auto-typed via Omit)
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    description: plan.description,
    planType: plan.planType,
    goals: toPlanGoalsView(plan.goals),
    progression: plan.progression,
    constraints: plan.constraints,
    weeks: plan.weeks.map(toWeeklyScheduleView),
    status: plan.status,
    currentPosition: plan.currentPosition,

    // Date serialization
    startDate: plan.startDate.toISOString(),
    endDate: plan.endDate?.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt?.toISOString(),

    // Enriched fields
    currentWorkout: currentWorkout ? toWorkoutTemplateView(currentWorkout) : undefined,
    currentWeek: currentWeek ? toWeeklyScheduleView(currentWeek) : undefined,
    summary,
  };
}
