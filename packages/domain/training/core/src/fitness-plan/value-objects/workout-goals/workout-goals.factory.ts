import { Result, Guard } from '@bene/shared-domain';
import { GoalsValidationError } from '../../errors/fitness-plan-errors.js';
import {
  CompletionCriteria,
  DistanceGoal,
  DurationGoal,
  VolumeGoal,
  WorkoutGoals,
} from './workout-goals.types.js';

export interface WorkoutGoalsProps {
  distance?: DistanceGoal;
  duration?: DurationGoal;
  volume?: VolumeGoal;
  completionCriteria: CompletionCriteria;
}

export function createWorkoutGoals(props: WorkoutGoalsProps): Result<WorkoutGoals> {
  const guardResult = Guard.againstNullOrUndefined(
    props.completionCriteria,
    'completionCriteria',
  );

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  // Validate only one goal type is specified
  const goalTypes = [
    props.distance ? 1 : 0,
    props.duration ? 1 : 0,
    props.volume ? 1 : 0,
  ].filter(Boolean).length;

  if (goalTypes > 1) {
    return Result.fail(
      new GoalsValidationError(
        'Only one goal type (distance, duration, or volume) can be specified',
      ),
    );
  }

  if (goalTypes === 0) {
    return Result.fail(
      new GoalsValidationError('At least one goal type must be specified'),
    );
  }

  // Validate distance goal
  if (props.distance) {
    if (props.distance.value <= 0) {
      return Result.fail(
        new GoalsValidationError('Distance must be positive', {
          distance: props.distance.value,
        }),
      );
    }

    if (props.distance.pace) {
      if (props.distance.pace.min <= 0 || props.distance.pace.max <= 0) {
        return Result.fail(
          new GoalsValidationError('Pace values must be positive', {
            pace: props.distance.pace,
          }),
        );
      }
      if (props.distance.pace.min > props.distance.pace.max) {
        return Result.fail(
          new GoalsValidationError('Min pace must be less than max pace', {
            pace: props.distance.pace,
          }),
        );
      }
    }
  }

  // Validate duration goal
  if (props.duration) {
    if (props.duration.value <= 0) {
      return Result.fail(
        new GoalsValidationError('Duration must be positive', {
          duration: props.duration.value,
        }),
      );
    }
  }

  // Validate volume goal
  if (props.volume) {
    if (props.volume.totalSets <= 0) {
      return Result.fail(
        new GoalsValidationError('Total sets must be positive', {
          totalSets: props.volume.totalSets,
        }),
      );
    }
    if (props.volume.totalReps <= 0) {
      return Result.fail(
        new GoalsValidationError('Total reps must be positive', {
          totalReps: props.volume.totalReps,
        }),
      );
    }
  }

  // Validate completion criteria
  if (props.completionCriteria.minimumEffort !== undefined) {
    if (
      props.completionCriteria.minimumEffort < 0 ||
      props.completionCriteria.minimumEffort > 1
    ) {
      return Result.fail(
        new GoalsValidationError('Minimum effort must be between 0 and 1', {
          minimumEffort: props.completionCriteria.minimumEffort,
        }),
      );
    }
  }

  return Result.ok(props);
}

// Factory methods for common goal types
export function createDistanceWorkout(
  distance: number,
  unit: 'meters' | 'km' | 'miles',
  criteria: CompletionCriteria,
): Result<WorkoutGoals> {
  return createWorkoutGoals({
    distance: { value: distance, unit },
    completionCriteria: criteria,
  });
}

export function createDurationWorkout(
  duration: number,
  criteria: CompletionCriteria,
  intensity?: 'easy' | 'moderate' | 'hard' | 'max',
): Result<WorkoutGoals> {
  return createWorkoutGoals({
    duration: { value: duration, intensity },
    completionCriteria: criteria,
  });
}

export function createVolumeWorkout(
  totalSets: number,
  totalReps: number,
  criteria: CompletionCriteria,
): Result<WorkoutGoals> {
  return createWorkoutGoals({
    volume: { totalSets, totalReps },
    completionCriteria: criteria,
  });
}
