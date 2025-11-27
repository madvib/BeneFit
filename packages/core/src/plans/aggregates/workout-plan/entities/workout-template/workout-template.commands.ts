// workout-template.commands.ts
import { Result, Guard } from '@shared';
import { WorkoutStateTransitionError, WorkoutModificationError, WorkoutTemplateValidationError } from '../../../../errors/workout-plan-errors.js';
import { WorkoutActivity } from '../../../../value-objects/workout-activity/index.js';
import { WorkoutGoals } from '../../../../value-objects/workout-goals/index.js';
import { WorkoutAlternative, WorkoutTemplate } from './workout-template.types.js';


/**
 * COMMAND: Transitions status to 'in_progress'.
 */
export function startWorkout(template: WorkoutTemplate): Result<WorkoutTemplate> {
  if (template.status !== 'scheduled') {
    return Result.fail(new WorkoutStateTransitionError(`Cannot start workout with status: ${ template.status }`));
  }
  // ... all late start validation logic remains here ...

  return Result.ok({
    ...template,
    status: 'in_progress',
  });
}

/**
 * COMMAND: Transitions status to 'completed'.
 */
export function markComplete(template: WorkoutTemplate, completedWorkoutId: string): Result<WorkoutTemplate> {
  const guardResult = Guard.againstEmptyString(completedWorkoutId, 'completedWorkoutId');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  if (template.status !== 'scheduled' && template.status !== 'in_progress') {
    return Result.fail(new WorkoutStateTransitionError(`Cannot complete workout with status: ${ template.status }`));
  }

  return Result.ok({
    ...template,
    status: 'completed',
    completedWorkoutId,
  });
}

/**
 * COMMAND: Transitions status to 'skipped'.
 */
export function skipWorkout(template: WorkoutTemplate, reason: string): Result<WorkoutTemplate> {
  const guardResult = Guard.againstEmptyString(reason, 'reason');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  if (template.status !== 'scheduled') {
    return Result.fail(new WorkoutStateTransitionError(`Cannot skip workout with status: ${ template.status }`));
  }

  return Result.ok({
    ...template,
    status: 'skipped',
    userNotes: reason,
  });
}

/**
 * COMMAND: Reschedules the workout.
 */
export function rescheduleWorkout(template: WorkoutTemplate, newDate: string): Result<WorkoutTemplate> {
  if (template.status !== 'scheduled') {
    return Result.fail(new WorkoutStateTransitionError(`Cannot reschedule workout with status: ${ template.status }`));
  }
  // ... new date validation logic remains the same ...

  return Result.ok({
    ...template,
    status: 'rescheduled',
    rescheduledTo: newDate,
  });
}

// --- Modifications ---

/**
 * COMMAND: Updates the goals of a scheduled workout.
 */
export function updateGoals(template: WorkoutTemplate, newGoals: WorkoutGoals): Result<WorkoutTemplate> {
  if (template.status !== 'scheduled') {
    return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts'));
  }

  return Result.ok({
    ...template,
    goals: newGoals,
  });
}

/**
 * COMMAND: Adds a single activity to a scheduled workout.
 */
export function addActivity(template: WorkoutTemplate, activity: WorkoutActivity): Result<WorkoutTemplate> {
  if (template.status !== 'scheduled') {
    return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts'));
  }

  // Pure update: create a new activities array
  const newActivities = [...template.activities, activity];

  return Result.ok({
    ...template,
    activities: newActivities,
  });
}

/**
 * COMMAND: Adds an alternative option to the template.
 */
export function addAlternative(template: WorkoutTemplate, alternative: WorkoutAlternative): Result<WorkoutTemplate> {
  if (alternative.activities.length === 0) {
    return Result.fail(new WorkoutTemplateValidationError('Alternative must have at least one activity'));
  }

  // Handle initial creation of alternatives array immutably
  const currentAlternatives = template.alternatives || [];
  const newAlternatives = [...currentAlternatives, alternative];

  return Result.ok({
    ...template,
    alternatives: newAlternatives,
  });
}

/**
 * COMMAND: Updates user notes (not restricted by status).
 */
export function addUserNotes(template: WorkoutTemplate, notes: string): WorkoutTemplate {
  const newNotes = template.userNotes ? template.userNotes + '\n' + notes : notes;

  return {
    ...template,
    userNotes: newNotes,
  };
}