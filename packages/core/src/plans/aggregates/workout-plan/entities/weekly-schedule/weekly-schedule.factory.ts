// weekly-schedule.factory.ts
import { Result, Guard } from '@shared';
import { WeeklySchedule, WeeklyScheduleData } from './weekly-schedule.types.js';
import { ScheduleValidationError } from '../../../../errors/workout-plan-errors.js';

type CreateScheduleParams = Omit<WeeklyScheduleData, 'id' | 'workoutsCompleted'> & { id: string };

/**
 * FACTORY: Creates a new WeeklySchedule instance with validation.
 * Returns a new, immutable WeeklySchedule object upon success.
 */
export function createWeeklySchedule(params: CreateScheduleParams): Result<WeeklySchedule> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(params.planId, 'planId'),
    Guard.againstEmptyString(params.focus, 'focus'),
    Guard.againstNullOrUndefined(params.weekNumber, 'weekNumber'),
    // ... other guards
  ]);

  if (guardResult.isFailure) return Result.fail(guardResult.error);

  // Business rule validation
  if (params.weekNumber < 1) {
    return Result.fail(new ScheduleValidationError('Week number must be >= 1', { weekNumber: params.weekNumber }));
  }
  if (params.targetWorkouts < 0) {
    return Result.fail(new ScheduleValidationError('Target workouts must be >= 0', { targetWorkouts: params.targetWorkouts }));
  }
  // Date validation
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  if (start >= end) {
    return Result.fail(new ScheduleValidationError('Start date must be before end date', { startDate: params.startDate, endDate: params.endDate }));
  }

  const data: WeeklyScheduleData = {
    ...params,
    workoutsCompleted: 0,
  };

  return Result.ok(data); // Return the immutable data object
}

/**
 * FACTORY: Rehydrates WeeklySchedule from the database.
 */
export function weeklyScheduleFromPersistence(data: WeeklyScheduleData): Result<WeeklySchedule> {
  // Perform any necessary data transformation or re-validation here if needed
  return Result.ok(data);
}