import { DomainError } from '../../shared/errors/DomainError.js';

/**
 * Base class for all workout plan domain errors
 */
abstract class WorkoutPlanError extends DomainError {
  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message, `WORKOUT_PLAN_${ code }`, context);
  }
}

// ============================================================================
// Workout Template Errors
// ============================================================================

/**
 * Error thrown when workout template validation fails
 */
export class WorkoutTemplateValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'TEMPLATE_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when attempting an invalid state transition on a workout
 */
export class WorkoutStateTransitionError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_STATE_TRANSITION', context);
  }
}

/**
 * Error thrown when attempting to modify a workout that cannot be modified
 */
export class WorkoutModificationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'MODIFICATION_NOT_ALLOWED', context);
  }
}

/**
 * Error thrown when workout activity operations fail
 */
export class WorkoutActivityError extends WorkoutPlanError {
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
export class ScheduleValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SCHEDULE_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when there's a scheduling conflict (e.g., day slot already occupied)
 */
export class ScheduleConflictError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SCHEDULE_CONFLICT', context);
  }
}

/**
 * Error thrown when a workout is not found in the schedule
 */
export class WorkoutNotFoundError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'WORKOUT_NOT_FOUND', context);
  }
}

/**
 * Error thrown when attempting to modify a schedule inappropriately
 */
export class ScheduleModificationError extends WorkoutPlanError {
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
export class PlanStateError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INVALID_PLAN_STATE', context);
  }
}

/**
 * Error thrown when plan activation fails
 */
export class PlanActivationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ACTIVATION_ERROR', context);
  }
}

/**
 * Error thrown when workout completion operation fails
 */
export class PlanCompletionError extends WorkoutPlanError {
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
export class GoalsValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'GOALS_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when plan position validation fails
 */
export class PositionValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'POSITION_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when workout activity validation fails
 */
export class ActivityValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ACTIVITY_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when activity structure validation fails
 */
export class StructureValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'STRUCTURE_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when training constraints validation fails
 */
export class ConstraintsValidationError extends WorkoutPlanError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONSTRAINTS_VALIDATION_ERROR', context);
  }
}

