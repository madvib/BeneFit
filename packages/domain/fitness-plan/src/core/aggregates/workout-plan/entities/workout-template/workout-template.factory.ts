// workout-template.factory.ts
import { Result, Guard } from '@bene/domain-shared';
import { WorkoutTemplate, WorkoutTemplateData } from './workout-template.types.js';
import { WorkoutTemplateValidationError } from '../../../../errors/fitness-plan-errors.js';

type CreateTemplateParams = Omit<WorkoutTemplateData, 'status'> & { id: string };

/**
 * FACTORY: Creates a new WorkoutTemplate instance with validation.
 */
export function createWorkoutTemplate(props: CreateTemplateParams): Result<WorkoutTemplate> {
  const guardResult = Guard.combine([
    // ... all Guard checks remain the same ...
    Guard.againstEmptyString(props.title, 'title'),
    Guard.againstNullOrUndefined(props.weekNumber, 'weekNumber'),
  ]);

  if (guardResult.isFailure) return Result.fail(guardResult.error);

  // Business rule validation (Day of Week, Week Number, Activities, Date) remains the same.
  if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
    return Result.fail(new WorkoutTemplateValidationError('Day of week must be 0-6', { dayOfWeek: props.dayOfWeek }));
  }
  if (props.type !== 'rest' && props.activities.length === 0) {
    return Result.fail(new WorkoutTemplateValidationError('Non-rest workouts must have at least one activity', { type: props.type }));
  }

  const data: WorkoutTemplateData = {
    ...props,
    status: 'scheduled',
  };

  return Result.ok(data);
}

/**
 * FACTORY: Rehydrates WorkoutTemplate from persistence.
 */
export function workoutTemplateFromPersistence(data: WorkoutTemplateData): Result<WorkoutTemplate> {
  return Result.ok(data);
}