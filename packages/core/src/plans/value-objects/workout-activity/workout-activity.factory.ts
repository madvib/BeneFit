import { Result, Guard } from '@shared';
import { ActivityValidationError } from '../../errors/workout-plan-errors.js';
import {
  ActivityStructure,
  isIntervalBased,
  isExerciseBased,
  getTotalDuration,
} from '../activity-structure/activity-structure.js';
import { WorkoutActivity, ActivityType } from './workout-activity.types.js';

export interface WorkoutActivityProps {
  readonly name: string;
  readonly type: ActivityType;
  readonly order: number;
  readonly structure?: ActivityStructure;
  readonly instructions?: readonly string[];
  readonly distance?: number; // meters
  readonly duration?: number; // minutes
  readonly pace?: string; // e.g., "easy", "moderate", "5:30/km"
  readonly videoUrl?: string;
  readonly equipment?: readonly string[];
  readonly alternativeExercises?: readonly string[];
}

export function createWorkoutActivity(
  props: WorkoutActivityProps,
): Result<WorkoutActivity> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(props.name, 'activity name'),
    Guard.againstNullOrUndefined(props.type, 'activity type'),
    Guard.againstNullOrUndefined(props.order, 'order'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  // Validate order
  if (props.order < 0) {
    return Result.fail(
      new ActivityValidationError('Order must be >= 0', { order: props.order }),
    );
  }

  // Validate distance
  if (props.distance !== undefined && props.distance <= 0) {
    return Result.fail(
      new ActivityValidationError('Distance must be positive', {
        distance: props.distance,
      }),
    );
  }

  // Validate duration
  if (props.duration !== undefined && props.duration <= 0) {
    return Result.fail(
      new ActivityValidationError('Duration must be positive', {
        duration: props.duration,
      }),
    );
  }

  // Validate video URL format (basic check)
  if (props.videoUrl !== undefined) {
    try {
      new URL(props.videoUrl);
    } catch {
      return Result.fail(
        new ActivityValidationError('Invalid video URL', { videoUrl: props.videoUrl }),
      );
    }
  }

  // Validate equipment array
  if (props.equipment) {
    for (const item of props.equipment) {
      const equipGuard = Guard.againstEmptyString(item, 'equipment item');
      if (equipGuard.isFailure) {
        return Result.fail(equipGuard.error);
      }
    }
  }

  return Result.ok(props);
}

// Factory methods for common activities
export function createWarmup(
  name: string,
  duration: number,
  order: number = 0,
): Result<WorkoutActivity> {
  return createWorkoutActivity({
    name,
    type: 'warmup',
    order,
    duration,
    instructions: ['Start slowly', 'Gradually increase intensity'],
  });
}

export function createCooldown(
  name: string,
  duration: number,
  order: number,
): Result<WorkoutActivity> {
  return createWorkoutActivity({
    name,
    type: 'cooldown',
    order,
    duration,
    instructions: ['Gradually decrease intensity', 'Focus on breathing'],
  });
}

export function createDistanceRun(
  distance: number,
  pace: string,
  order: number,
): Result<WorkoutActivity> {
  return createWorkoutActivity({
    name: `${distance}m run`,
    type: 'main',
    order,
    distance,
    pace,
    equipment: [],
  });
}

export function createIntervalSession(
  name: string,
  structure: ActivityStructure,
  order: number,
): Result<WorkoutActivity> {
  if (!isIntervalBased(structure)) {
    return Result.fail(
      new ActivityValidationError('Structure must be interval-based', {
        structureType: 'not-interval',
      }),
    );
  }

  return createWorkoutActivity({
    name,
    type: 'interval',
    order,
    structure,
    duration: getTotalDuration(structure) / 60, // Convert seconds to minutes
  });
}

export function createCircuit(
  name: string,
  structure: ActivityStructure,
  order: number,
  equipment?: string[],
): Result<WorkoutActivity> {
  if (!isExerciseBased(structure)) {
    return Result.fail(
      new ActivityValidationError('Structure must be exercise-based', {
        structureType: 'not-exercise',
      }),
    );
  }

  return createWorkoutActivity({
    name,
    type: 'circuit',
    order,
    structure,
    equipment,
    duration: getTotalDuration(structure) / 60,
  });
}
