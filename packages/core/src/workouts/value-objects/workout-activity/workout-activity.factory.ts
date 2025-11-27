// workout-activity.factory.ts
import { Result, Guard } from '@shared';
import { ActivityValidationError } from '../../../plans/errors/workout-plan-errors.js';
import { WorkoutActivity } from './workout-activity.types.js';
import { ActivityStructure } from '../activity-structure/activity-structure.types.js';
import { isIntervalBased, isExerciseBased } from '../activity-structure/activity-structure.queries.js';
import { getTotalDuration } from '../activity-structure/activity-structure.queries.js';

/**
 * FACTORY: Creates a new WorkoutActivity instance with validation.
 */
export function createWorkoutActivity(props: {
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | 'interval' | 'circuit';
  order: number;
  structure?: ActivityStructure;
  instructions?: readonly string[];
  distance?: number;
  duration?: number;
  pace?: string;
  videoUrl?: string;
  equipment?: readonly string[];
  alternativeExercises?: readonly string[];
}): Result<WorkoutActivity> {
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
    return Result.fail(new ActivityValidationError('Order must be >= 0', { order: props.order }));
  }

  // Validate distance
  if (props.distance !== undefined && props.distance <= 0) {
    return Result.fail(new ActivityValidationError('Distance must be positive', { distance: props.distance }));
  }

  // Validate duration
  if (props.duration !== undefined && props.duration <= 0) {
    return Result.fail(new ActivityValidationError('Duration must be positive', { duration: props.duration }));
  }

  // Validate video URL format (basic check)
  if (props.videoUrl !== undefined) {
    try {
      new URL(props.videoUrl);
    } catch {
      return Result.fail(new ActivityValidationError('Invalid video URL', { videoUrl: props.videoUrl }));
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

/**
 * FACTORY: Creates a warmup activity.
 */
export function createWarmup(name: string, duration: number, order: number = 0): Result<WorkoutActivity> {
  return createWorkoutActivity({
    name,
    type: 'warmup',
    order,
    duration,
    instructions: ['Start slowly', 'Gradually increase intensity'],
  });
}

/**
 * FACTORY: Creates a cooldown activity.
 */
export function createCooldown(name: string, duration: number, order: number): Result<WorkoutActivity> {
  return createWorkoutActivity({
    name,
    type: 'cooldown',
    order,
    duration,
    instructions: ['Gradually decrease intensity', 'Focus on breathing'],
  });
}

/**
 * FACTORY: Creates a distance run activity.
 */
export function createDistanceRun(distance: number, pace: string, order: number): Result<WorkoutActivity> {
  return createWorkoutActivity({
    name: `${ distance }m run`,
    type: 'main',
    order,
    distance,
    pace,
    equipment: [],
  });
}

/**
 * FACTORY: Creates an interval session activity.
 */
export function createIntervalSession(
  name: string,
  structure: ActivityStructure,
  order: number
): Result<WorkoutActivity> {
  if (!isIntervalBased(structure)) {
    return Result.fail(
      new ActivityValidationError('Structure must be interval-based', { structureType: 'not-interval' })
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

/**
 * FACTORY: Creates a circuit activity.
 */
export function createCircuit(
  name: string,
  structure: ActivityStructure,
  order: number,
  equipment?: string[]
): Result<WorkoutActivity> {
  if (!isExerciseBased(structure)) {
    return Result.fail(
      new ActivityValidationError('Structure must be exercise-based', { structureType: 'not-exercise' })
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
