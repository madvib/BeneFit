// workout-activity.commands.ts
import { Result, Guard } from '@bene/shared-domain';
import { ActivityValidationError } from '../../errors/workout-errors.js';
import { WorkoutActivity } from './workout-activity.types.js';
import { ActivityStructure } from '../activity-structure/activity-structure.types.js';
import { getTotalDuration } from '../activity-structure/activity-structure.queries.js';
import { adjustIntensity as adjustStructureIntensity } from '../activity-structure/activity-structure.commands.js';
import { isWarmup, isCooldown } from './workout-activity.queries.js';
import { URL } from 'url';

/**
 * COMMAND: Set duration.
 */
export function setDuration(
  activity: WorkoutActivity,
  duration: number,
): Result<WorkoutActivity> {
  if (duration <= 0) {
    return Result.fail(
      new ActivityValidationError('Duration must be positive', { duration }),
    );
  }

  return Result.ok({
    ...activity,
    duration,
  });
}

/**
 * COMMAND: Set distance.
 */
export function setDistance(
  activity: WorkoutActivity,
  distance: number,
): Result<WorkoutActivity> {
  if (distance <= 0) {
    return Result.fail(
      new ActivityValidationError('Distance must be positive', { distance }),
    );
  }

  return Result.ok({
    ...activity,
    distance,
  });
}

/**
 * COMMAND: Set pace.
 */
export function setPace(
  activity: WorkoutActivity,
  pace: string,
): Result<WorkoutActivity> {
  const guardResult = Guard.againstEmptyString(pace, 'pace');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...activity,
    pace,
  });
}

/**
 * COMMAND: Set structure.
 */
export function setStructure(
  activity: WorkoutActivity,
  structure: ActivityStructure,
): WorkoutActivity {
  return {
    ...activity,
    structure,
  };
}

/**
 * COMMAND: Adjust structure using a transformation function.
 */
export function adjustStructure(
  activity: WorkoutActivity,
  adjustment: (structure: ActivityStructure) => ActivityStructure,
): Result<WorkoutActivity> {
  if (!activity.structure) {
    return Result.fail(new ActivityValidationError('No structure to adjust'));
  }

  const adjustedStructure = adjustment(activity.structure);

  return Result.ok({
    ...activity,
    structure: adjustedStructure,
    duration: getTotalDuration(adjustedStructure) / 60,
  });
}

/**
 * COMMAND: Add instruction.
 */
export function addInstruction(
  activity: WorkoutActivity,
  instruction: string,
): Result<WorkoutActivity> {
  const guardResult = Guard.againstEmptyString(instruction, 'instruction');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const instructions = activity.instructions
    ? [...activity.instructions, instruction]
    : [instruction];

  return Result.ok({
    ...activity,
    instructions,
  });
}

/**
 * COMMAND: Set video URL.
 */
export function setVideo(
  activity: WorkoutActivity,
  videoUrl: string,
): Result<WorkoutActivity> {
  try {
    new URL(videoUrl);
  } catch {
    return Result.fail(new ActivityValidationError('Invalid video URL', { videoUrl }));
  }

  return Result.ok({
    ...activity,
    videoUrl,
  });
}

/**
 * COMMAND: Add alternative exercise.
 */
export function addAlternative(
  activity: WorkoutActivity,
  exercise: string,
): Result<WorkoutActivity> {
  const guardResult = Guard.againstEmptyString(exercise, 'alternative exercise');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const alternatives = activity.alternativeExercises
    ? [...activity.alternativeExercises, exercise]
    : [exercise];

  return Result.ok({
    ...activity,
    alternativeExercises: alternatives,
  });
}

/**
 * COMMAND: Set order.
 */
export function setOrder(
  activity: WorkoutActivity,
  order: number,
): Result<WorkoutActivity> {
  if (order < 0) {
    return Result.fail(new ActivityValidationError('Order must be >= 0', { order }));
  }

  return Result.ok({
    ...activity,
    order,
  });
}

/**
 * COMMAND: Adjust activity for fatigue level.
 */
export function adjustForFatigue(
  activity: WorkoutActivity,
  fatigueLevel: number,
): Result<WorkoutActivity> {
  // fatigueLevel: 0 (fresh) to 1 (exhausted)
  if (fatigueLevel < 0 || fatigueLevel > 1) {
    return Result.fail(
      new ActivityValidationError('Fatigue level must be 0-1', { fatigueLevel }),
    );
  }

  // Don't adjust warmup/cooldown
  if (isWarmup(activity) || isCooldown(activity)) {
    return Result.ok(activity);
  }

  let adjusted: WorkoutActivity = activity;

  // Adjust duration
  if (activity.duration) {
    const durationAdjustment = 1 - fatigueLevel * 0.3; // Up to 30% reduction
    const newDuration = Math.max(5, Math.round(activity.duration * durationAdjustment));
    adjusted = {
      ...adjusted,
      duration: newDuration,
    };
  }

  // Adjust structure intensity
  if (activity.structure) {
    const intensityAdjustment = 1 - fatigueLevel * 0.25; // Up to 25% easier
    const adjustedStructure = adjustStructureIntensity(
      activity.structure,
      intensityAdjustment,
    );
    adjusted = {
      ...adjusted,
      structure: adjustedStructure,
    };
  }

  // Adjust distance
  if (activity.distance) {
    const distanceAdjustment = 1 - fatigueLevel * 0.2; // Up to 20% shorter
    const newDistance = Math.max(
      100,
      Math.round(activity.distance * distanceAdjustment),
    );
    adjusted = {
      ...adjusted,
      distance: newDistance,
    };
  }

  return Result.ok(adjusted);
}

/**
 * COMMAND: Make activity easier.
 */
export function makeEasier(
  activity: WorkoutActivity,
  factor: number = 0.8,
): Result<WorkoutActivity> {
  if (factor <= 0 || factor >= 1) {
    return Result.fail(
      new ActivityValidationError('Factor must be between 0 and 1', { factor }),
    );
  }

  // Don't adjust warmup/cooldown
  if (isWarmup(activity) || isCooldown(activity)) {
    return Result.ok(activity);
  }

  let adjusted: WorkoutActivity = activity;

  // Reduce duration
  if (activity.duration) {
    adjusted = {
      ...adjusted,
      duration: Math.max(5, Math.round(activity.duration * factor)),
    };
  }

  // Reduce intensity via structure
  if (activity.structure) {
    adjusted = {
      ...adjusted,
      structure: adjustStructureIntensity(activity.structure, factor),
    };
  }

  // Reduce distance
  if (activity.distance) {
    adjusted = {
      ...adjusted,
      distance: Math.max(100, Math.round(activity.distance * factor)),
    };
  }

  return Result.ok(adjusted);
}

/**
 * COMMAND: Make activity harder.
 */
export function makeHarder(
  activity: WorkoutActivity,
  factor: number = 1.2,
): Result<WorkoutActivity> {
  if (factor <= 1) {
    return Result.fail(new ActivityValidationError('Factor must be > 1', { factor }));
  }

  // Don't adjust warmup/cooldown
  if (isWarmup(activity) || isCooldown(activity)) {
    return Result.ok(activity);
  }

  let adjusted: WorkoutActivity = activity;

  // Increase duration
  if (activity.duration) {
    adjusted = {
      ...adjusted,
      duration: Math.round(activity.duration * factor),
    };
  }

  // Increase intensity via structure
  if (activity.structure) {
    adjusted = {
      ...adjusted,
      structure: adjustStructureIntensity(activity.structure, factor),
    };
  }

  // Increase distance
  if (activity.distance) {
    adjusted = {
      ...adjusted,
      distance: Math.round(activity.distance * factor),
    };
  }

  return Result.ok(adjusted);
}
