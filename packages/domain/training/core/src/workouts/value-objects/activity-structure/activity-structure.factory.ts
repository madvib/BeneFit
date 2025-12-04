// activity-structure.factory.ts
import { Result, Guard } from '@bene/shared-domain';
import { StructureValidationError } from '../../errors/workout-errors.js';
import { ActivityStructure, Interval, Exercise } from './activity-structure.types.js';

/**
 * FACTORY: Creates a new ActivityStructure instance with validation.
 */
export function createActivityStructure(props: {
  intervals?: readonly Interval[];
  rounds?: number;
  exercises?: readonly Exercise[];
}): Result<ActivityStructure> {
  // Validation for intervals
  if (props.intervals) {
    for (const interval of props.intervals) {
      if (interval.duration <= 0) {
        return Result.fail(
          new StructureValidationError('Interval duration must be positive', {
            duration: interval.duration,
          }),
        );
      }
      if (interval.rest < 0) {
        return Result.fail(
          new StructureValidationError('Interval rest cannot be negative', {
            rest: interval.rest,
          }),
        );
      }
    }
  }

  // Validation for exercises
  if (props.exercises) {
    for (const exercise of props.exercises) {
      const guardResult = Guard.againstEmptyString(exercise.name, 'exercise name');
      if (guardResult.isFailure) {
        return Result.fail(guardResult.error);
      }

      if (exercise.sets <= 0) {
        return Result.fail(
          new StructureValidationError('Exercise sets must be positive', {
            exerciseName: exercise.name,
            sets: exercise.sets,
          }),
        );
      }

      if (exercise.rest < 0) {
        return Result.fail(
          new StructureValidationError('Exercise rest cannot be negative', {
            exerciseName: exercise.name,
            rest: exercise.rest,
          }),
        );
      }

      if (exercise.weight !== undefined && exercise.weight < 0) {
        return Result.fail(
          new StructureValidationError('Exercise weight cannot be negative', {
            exerciseName: exercise.name,
            weight: exercise.weight,
          }),
        );
      }
    }
  }

  // Validation for rounds
  if (props.rounds !== undefined && props.rounds <= 0) {
    return Result.fail(
      new StructureValidationError('Rounds must be positive', { rounds: props.rounds }),
    );
  }

  // Can't have both intervals and exercises
  if (props.intervals && props.exercises) {
    return Result.fail(
      new StructureValidationError(
        'Activity structure cannot have both intervals and exercises',
      ),
    );
  }

  return Result.ok(props);
}

/**
 * FACTORY: Creates an empty ActivityStructure.
 */
export function createEmptyActivityStructure(): ActivityStructure {
  return {};
}

/**
 * FACTORY: Creates an interval-based ActivityStructure.
 */
export function createIntervalStructure(
  intervals: Interval[],
  rounds?: number,
): Result<ActivityStructure> {
  return createActivityStructure({ intervals, rounds });
}

/**
 * FACTORY: Creates an exercise-based ActivityStructure.
 */
export function createExerciseStructure(
  exercises: Exercise[],
  rounds?: number,
): Result<ActivityStructure> {
  return createActivityStructure({ exercises, rounds });
}
