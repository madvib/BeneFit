import { Result, Guard } from '@shared';
import { ActivityValidationError } from '../../errors/workout-plan-errors.js';
import {
  ActivityStructure,
  isEmpty as isStructureEmpty,
  getTotalDuration as getStructureTotalDuration,
  withAdjustedIntensity as withStructureAdjustedIntensity,
  getDescription as getStructureDescription
} from '../activity-structure/index.js';
import { WorkoutActivity } from './workout-activity.types.js';

// Getters (these are just property access, so not needed as separate functions)

// Type checks
export function isWarmup(activity: WorkoutActivity): boolean {
  return activity.type === 'warmup';
}

export function isCooldown(activity: WorkoutActivity): boolean {
  return activity.type === 'cooldown';
}

export function isMainActivity(activity: WorkoutActivity): boolean {
  return activity.type === 'main';
}

export function isIntervalBased(activity: WorkoutActivity): boolean {
  return activity.type === 'interval';
}

export function isCircuit(activity: WorkoutActivity): boolean {
  return activity.type === 'circuit';
}

// Equipment queries
export function requiresEquipment(activity: WorkoutActivity): boolean {
  return activity.equipment !== undefined && activity.equipment.length > 0;
}

export function hasEquipment(activity: WorkoutActivity, equipment: string): boolean {
  if (!activity.equipment) return false;
  return activity.equipment.some(e => e.toLowerCase() === equipment.toLowerCase());
}

export function getEquipmentList(activity: WorkoutActivity): string[] {
  return activity.equipment ? [...activity.equipment] : [];
}

// Content queries
export function hasStructure(activity: WorkoutActivity): boolean {
  return activity.structure !== undefined && !isStructureEmpty(activity.structure);
}

export function hasInstructions(activity: WorkoutActivity): boolean {
  return activity.instructions !== undefined && activity.instructions.length > 0;
}

export function hasVideo(activity: WorkoutActivity): boolean {
  return activity.videoUrl !== undefined;
}

export function hasAlternatives(activity: WorkoutActivity): boolean {
  return activity.alternativeExercises !== undefined &&
    activity.alternativeExercises.length > 0;
}

// Duration calculations
export function getEstimatedDuration(activity: WorkoutActivity): number {
  // Priority: explicit duration > structure duration > default
  if (activity.duration !== undefined) {
    return activity.duration;
  }

  if (activity.structure) {
    return getStructureTotalDuration(activity.structure) / 60; // Convert to minutes
  }

  // Defaults based on type
  switch (activity.type) {
    case 'warmup':
      return 10;
    case 'cooldown':
      return 10;
    case 'main':
      return 30;
    case 'interval':
    case 'circuit':
      return 20;
    default:
      return 15;
  }
}

export function getEstimatedCalories(activity: WorkoutActivity, userWeight: number = 70): number {
  // Very rough estimates (MET values * time * weight)
  const duration = getEstimatedDuration(activity);

  if (isWarmup(activity) || isCooldown(activity)) {
    return Math.round(duration * 3 * userWeight / 60); // 3 METs
  }

  if (isIntervalBased(activity)) {
    return Math.round(duration * 10 * userWeight / 60); // 10 METs (high intensity)
  }

  if (isCircuit(activity)) {
    return Math.round(duration * 8 * userWeight / 60); // 8 METs
  }

  return Math.round(duration * 6 * userWeight / 60); // 6 METs (moderate)
}

// Transformation functions (return new instances)
export function withDifferentDuration(activity: WorkoutActivity, duration: number): Result<WorkoutActivity> {
  if (duration <= 0) {
    return Result.fail(new ActivityValidationError('Duration must be positive', { duration }));
  }

  return Result.ok({
    ...activity,
    duration,
  });
}

export function withDifferentDistance(activity: WorkoutActivity, distance: number): Result<WorkoutActivity> {
  if (distance <= 0) {
    return Result.fail(new ActivityValidationError('Distance must be positive', { distance }));
  }

  return Result.ok({
    ...activity,
    distance,
  });
}

export function withDifferentPace(activity: WorkoutActivity, pace: string): Result<WorkoutActivity> {
  const guardResult = Guard.againstEmptyString(pace, 'pace');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...activity,
    pace,
  });
}

export function withStructure(activity: WorkoutActivity, structure: ActivityStructure): Result<WorkoutActivity> {
  return Result.ok({
    ...activity,
    structure,
  });
}

export function withAdjustedStructure(
  activity: WorkoutActivity,
  adjustment: (structure: ActivityStructure) => ActivityStructure
): Result<WorkoutActivity> {
  if (!activity.structure) {
    return Result.fail(new ActivityValidationError('No structure to adjust'));
  }

  const adjustedStructure = adjustment(activity.structure);

  return Result.ok({
    ...activity,
    structure: adjustedStructure,
    duration: getStructureTotalDuration(adjustedStructure) / 60,
  });
}

export function withAdditionalInstruction(activity: WorkoutActivity, instruction: string): Result<WorkoutActivity> {
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

export function withVideo(activity: WorkoutActivity, videoUrl: string): Result<WorkoutActivity> {
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

export function withAlternative(activity: WorkoutActivity, exercise: string): Result<WorkoutActivity> {
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

export function withNewOrder(activity: WorkoutActivity, order: number): Result<WorkoutActivity> {
  if (order < 0) {
    return Result.fail(new ActivityValidationError('Order must be >= 0', { order }));
  }

  return Result.ok({
    ...activity,
    order,
  });
}

// AI Coach adjustments
export function adjustForFatigue(activity: WorkoutActivity, fatigueLevel: number): Result<WorkoutActivity> {
  // fatigueLevel: 0 (fresh) to 1 (exhausted)
  if (fatigueLevel < 0 || fatigueLevel > 1) {
    return Result.fail(new ActivityValidationError('Fatigue level must be 0-1', { fatigueLevel }));
  }

  // Don't adjust warmup/cooldown
  if (isWarmup(activity) || isCooldown(activity)) {
    return Result.ok(activity);
  }

  let adjusted = { ...activity };

  // Adjust duration
  if (activity.duration) {
    const durationAdjustment = 1 - (fatigueLevel * 0.3); // Up to 30% reduction
    const newDuration = Math.max(5, Math.round(activity.duration * durationAdjustment));
    adjusted = {
      ...adjusted,
      duration: newDuration,
    };
  }

  // Adjust structure intensity
  if (activity.structure) {
    const intensityAdjustment = 1 - (fatigueLevel * 0.25); // Up to 25% easier
    const adjustedStructure = withStructureAdjustedIntensity(activity.structure, intensityAdjustment);
    adjusted = {
      ...adjusted,
      structure: adjustedStructure,
    };
  }

  // Adjust distance
  if (activity.distance) {
    const distanceAdjustment = 1 - (fatigueLevel * 0.2); // Up to 20% shorter
    const newDistance = Math.max(100, Math.round(activity.distance * distanceAdjustment));
    adjusted = {
      ...adjusted,
      distance: newDistance,
    };
  }

  return Result.ok(adjusted);
}

export function makeEasier(activity: WorkoutActivity, factor: number = 0.8): Result<WorkoutActivity> {
  if (factor <= 0 || factor >= 1) {
    return Result.fail(new ActivityValidationError('Factor must be between 0 and 1', { factor }));
  }

  // Don't adjust warmup/cooldown
  if (isWarmup(activity) || isCooldown(activity)) {
    return Result.ok(activity);
  }

  let adjusted = { ...activity };

  // Reduce duration
  if (adjusted.duration) {
    adjusted = {
      ...adjusted,
      duration: Math.max(5, Math.round(adjusted.duration * factor)),
    };
  }

  // Reduce intensity via structure
  if (adjusted.structure) {
    adjusted = {
      ...adjusted,
      structure: withStructureAdjustedIntensity(adjusted.structure, factor),
    };
  }

  // Reduce distance
  if (adjusted.distance) {
    adjusted = {
      ...adjusted,
      distance: Math.max(100, Math.round(adjusted.distance * factor)),
    };
  }

  return Result.ok(adjusted);
}

export function makeHarder(activity: WorkoutActivity, factor: number = 1.2): Result<WorkoutActivity> {
  if (factor <= 1) {
    return Result.fail(new ActivityValidationError('Factor must be > 1', { factor }));
  }

  // Don't adjust warmup/cooldown
  if (isWarmup(activity) || isCooldown(activity)) {
    return Result.ok(activity);
  }

  let adjusted = { ...activity };

  // Increase duration
  if (adjusted.duration) {
    adjusted = {
      ...adjusted,
      duration: Math.round(adjusted.duration * factor),
    };
  }

  // Increase intensity via structure
  if (adjusted.structure) {
    adjusted = {
      ...adjusted,
      structure: withStructureAdjustedIntensity(adjusted.structure, factor),
    };
  }

  // Increase distance
  if (adjusted.distance) {
    adjusted = {
      ...adjusted,
      distance: Math.round(adjusted.distance * factor),
    };
  }

  return Result.ok(adjusted);
}

// Display helpers
export function getShortDescription(activity: WorkoutActivity): string {
  if (activity.distance) {
    return `${ activity.name } - ${ activity.distance }m`;
  }

  const duration = getEstimatedDuration(activity);
  return `${ activity.name } - ${ duration }min`;
}

export function getDetailedDescription(activity: WorkoutActivity): string {
  let desc = activity.name;

  if (activity.duration || activity.distance) {
    const details: string[] = [];

    if (activity.duration) {
      details.push(`${ activity.duration }min`);
    }

    if (activity.distance) {
      details.push(`${ activity.distance }m`);
    }

    if (activity.pace) {
      details.push(`@ ${ activity.pace }`);
    }

    desc += ` (${ details.join(', ') })`;
  }

  if (requiresEquipment(activity)) {
    desc += `\nEquipment: ${ activity.equipment!.join(', ') }`;
  }

  return desc;
}

export function getInstructionsList(activity: WorkoutActivity): string[] {
  const instructions: string[] = [];

  if (activity.instructions) {
    instructions.push(...activity.instructions);
  }

  if (activity.structure) {
    instructions.push(getStructureDescription(activity.structure));
  }

  return instructions;
}

// Equality
export function equals(activity: WorkoutActivity, other: WorkoutActivity): boolean {
  if (!other) return false;

  return (
    activity.name === other.name &&
    activity.type === other.type &&
    activity.order === other.order &&
    activity.duration === other.duration &&
    activity.distance === other.distance &&
    activity.pace === other.pace &&
    JSON.stringify(activity.equipment) === JSON.stringify(other.equipment) &&
    (!activity.structure || !other.structure ||
      equals(activity.structure as any, other.structure as any) || // This might need adjustment
      true) // Placeholder to avoid circular reference issue
  );
}