// weekly-schedule.factory.ts
import { Result, Guard } from '@bene/shared';
import { randomUUID } from 'crypto';
import { WeeklySchedule, WeeklyScheduleView } from './weekly-schedule.types.js';
import { ScheduleValidationError } from '../../../../errors/fitness-plan-errors.js';
import { toWorkoutTemplateView } from '../workout-template/workout-template.factory.js';

type CreateScheduleParams = Omit<WeeklySchedule, 'id' | 'workoutsCompleted'>;

/**
 * FACTORY: Creates a new WeeklySchedule instance with validation.
 * Generates a unique ID internally.
 * Returns a new, immutable WeeklySchedule object upon success.
 */
export function createWeeklySchedule(
  params: CreateScheduleParams,
): Result<WeeklySchedule> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(params.planId, 'planId'),
    Guard.againstEmptyString(params.focus, 'focus'),
    Guard.againstNullOrUndefined(params.weekNumber, 'weekNumber'),
    // ... other guards
  ]);

  if (guardResult.isFailure) return Result.fail(guardResult.error);

  // Business rule validation
  if (params.weekNumber < 1) {
    return Result.fail(
      new ScheduleValidationError('Week number must be >= 1', {
        weekNumber: params.weekNumber,
      }),
    );
  }
  if (params.targetWorkouts < 0) {
    return Result.fail(
      new ScheduleValidationError('Target workouts must be >= 0', {
        targetWorkouts: params.targetWorkouts,
      }),
    );
  }
  // Date validation
  if (params.startDate >= params.endDate) {
    return Result.fail(
      new ScheduleValidationError('Start date must be before end date', {
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    );
  }

  // Workouts count validation
  if (params.workouts.length > params.targetWorkouts) {
    return Result.fail(
      new ScheduleValidationError(
        'Cannot have more workouts than target',
        { workoutsCount: params.workouts.length, targetWorkouts: params.targetWorkouts },
      ),
    );
  }

  // All validations passed, create the schedule
  return Result.ok({
    id: randomUUID(), // Generate ID internally
    weekNumber: params.weekNumber,
    planId: params.planId,
    startDate: params.startDate,
    endDate: params.endDate,
    focus: params.focus,
    targetWorkouts: params.targetWorkouts,
    workoutsCompleted: 0,
    workouts: params.workouts,
  });
}

/**
 * FACTORY: Rehydrates WeeklySchedule from the database.
 */
export function weeklyScheduleFromPersistence(
  data: WeeklySchedule,
): Result<WeeklySchedule> {
  // Perform any necessary data transformation or re-validation here if needed
  return Result.ok(data);
}

// ============================================
// CONVERSION (Entity → API View)
// ============================================

import { getWeekStatus } from './weekly-schedule.queries.js';

/**
 * Map WeeklySchedule entity to view model (API presentation)
 */
export function toWeeklyScheduleView(schedule: WeeklySchedule): WeeklyScheduleView {
  return {
    ...schedule,
    startDate: schedule.startDate.toISOString(),
    endDate: schedule.endDate.toISOString(),
    // Workouts mapped to their view representation
    workouts: schedule.workouts.map(toWorkoutTemplateView),
    progress: getWeekStatus(schedule),
  };
}
