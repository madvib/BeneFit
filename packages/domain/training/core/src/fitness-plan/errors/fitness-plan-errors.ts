import { DomainError } from '@bene/shared-domain';

/**
 * Base class for all workout plan domain errors
 */
abstract class FitnessPlanError extends DomainError {
  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message, `WORKOUT_PLAN_${code}`, context);
  }
}

// ============================================================================
// Workout Template Errors
// ============================================================================

/**
 * Error thrown when workout template validation fails
 */
export class WorkoutTemplateValidationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'TEMPLATE_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when attempting an invalid state transition on a workout
 */
export class WorkoutStateTransitionError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_STATE_TRANSITION', context);
  }
}

/**
 * Error thrown when attempting to modify a workout that cannot be modified
 */
export class WorkoutModificationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'MODIFICATION_NOT_ALLOWED', context);
  }
}

/**
 * Error thrown when workout activity operations fail
 */
export class WorkoutActivityError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ACTIVITY_ERROR', context);
  }
}

// ============================================================================
// Weekly Schedule Errors
// ============================================================================

/**
 * Error thrown when weekly schedule validation fails
 */
export class ScheduleValidationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SCHEDULE_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when there's a scheduling conflict (e.g., day slot already occupied)
 */
export class ScheduleConflictError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SCHEDULE_CONFLICT', context);
  }
}

/**
 * Error thrown when a workout is not found in the schedule
 */
export class WorkoutNotFoundError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'WORKOUT_NOT_FOUND', context);
  }
}

/**
 * Error thrown when attempting to modify a schedule inappropriately
 */
export class ScheduleModificationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SCHEDULE_MODIFICATION_ERROR', context);
  }
}

// ============================================================================
// Workout Plan Errors
// ============================================================================

/**
 * Error thrown when plan is in an invalid state for the requested operation
 */
export class PlanStateError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_PLAN_STATE', context);
  }
}

/**
 * Error thrown when plan activation fails
 */
export class PlanActivationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ACTIVATION_ERROR', context);
  }
}

/**
 * Error thrown when workout completion operation fails
 */
export class PlanCompletionError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'COMPLETION_ERROR', context);
  }
}

// ============================================================================
// Value Object Errors
// ============================================================================

/**
 * Error thrown when workout goals validation fails
 */
export class GoalsValidationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'GOALS_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when plan position validation fails
 */
export class PositionValidationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'POSITION_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when training constraints validation fails
 */
export class ConstraintsValidationError extends FitnessPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONSTRAINTS_VALIDATION_ERROR', context);
  }
}
