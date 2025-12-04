import { DomainError } from '@bene/shared-domain';

/**
 * Base class for all workout plan domain errors
 */
abstract class WorkoutError extends DomainError {
  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message, `WORKOUT_PLAN_${code}`, context);
  }
}
/**
 * Error thrown when workout activity validation fails
 */
export class ActivityValidationError extends WorkoutError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ACTIVITY_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when activity structure validation fails
 */
export class StructureValidationError extends WorkoutError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'STRUCTURE_VALIDATION_ERROR', context);
  }
}
