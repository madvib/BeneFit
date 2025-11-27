// workout-activity.queries.ts
import { WorkoutActivity } from './workout-activity.types.js';
import { getTotalDuration } from '../activity-structure/activity-structure.queries.js';
import { isEmpty } from '../activity-structure/activity-structure.queries.js';

/**
 * QUERY: Check if activity is a warmup.
 */
export function isWarmup(activity: WorkoutActivity): boolean {
  return activity.type === 'warmup';
}

/**
 * QUERY: Check if activity is a cooldown.
 */
export function isCooldown(activity: WorkoutActivity): boolean {
  return activity.type === 'cooldown';
}

/**
 * QUERY: Check if activity is a main activity.
 */
export function isMainActivity(activity: WorkoutActivity): boolean {
  return activity.type === 'main';
}

/**
 * QUERY: Check if activity is interval-based.
 */
export function isActivityIntervalBased(activity: WorkoutActivity): boolean {
  return activity.type === 'interval';
}

/**
 * QUERY: Check if activity is a circuit.
 */
export function isCircuit(activity: WorkoutActivity): boolean {
  return activity.type === 'circuit';
}

/**
 * QUERY: Check if activity requires equipment.
 */
export function activityRequiresEquipment(activity: WorkoutActivity): boolean {
  return activity.equipment !== undefined && activity.equipment.length > 0;
}

/**
 * QUERY: Check if activity has specific equipment.
 */
export function hasEquipment(activity: WorkoutActivity, equipment: string): boolean {
  if (!activity.equipment) return false;
  return activity.equipment.some((e) => e.toLowerCase() === equipment.toLowerCase());
}

/**
 * QUERY: Get equipment list.
 */
export function getEquipmentList(activity: WorkoutActivity): string[] {
  return activity.equipment ? [...activity.equipment] : [];
}

/**
 * QUERY: Check if activity has structure.
 */
export function hasStructure(activity: WorkoutActivity): boolean {
  return activity.structure !== undefined && !isEmpty(activity.structure);
}

/**
 * QUERY: Check if activity has instructions.
 */
export function hasInstructions(activity: WorkoutActivity): boolean {
  return activity.instructions !== undefined && activity.instructions.length > 0;
}

/**
 * QUERY: Check if activity has video.
 */
export function hasVideo(activity: WorkoutActivity): boolean {
  return activity.videoUrl !== undefined;
}

/**
 * QUERY: Check if activity has alternatives.
 */
export function hasAlternatives(activity: WorkoutActivity): boolean {
  return activity.alternativeExercises !== undefined && activity.alternativeExercises.length > 0;
}

/**
 * QUERY: Get estimated duration in minutes.
 */
export function getEstimatedDuration(activity: WorkoutActivity): number {
  // Priority: explicit duration > structure duration > default
  if (activity.duration !== undefined) {
    return activity.duration;
  }

  if (activity.structure) {
    return getTotalDuration(activity.structure) / 60; // Convert to minutes
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

/**
 * QUERY: Get estimated calories burned.
 */
export function getEstimatedCalories(activity: WorkoutActivity, userWeight: number = 70): number {
  // Very rough estimates (MET values * time * weight)
  const duration = getEstimatedDuration(activity);

  if (isWarmup(activity) || isCooldown(activity)) {
    return Math.round((duration * 3 * userWeight) / 60); // 3 METs
  }

  if (isActivityIntervalBased(activity)) {
    return Math.round((duration * 10 * userWeight) / 60); // 10 METs (high intensity)
  }

  if (isCircuit(activity)) {
    return Math.round((duration * 8 * userWeight) / 60); // 8 METs
  }

  return Math.round((duration * 6 * userWeight) / 60); // 6 METs (moderate)
}

/**
 * QUERY: Get short description.
 */
export function getShortDescription(activity: WorkoutActivity): string {
  if (activity.distance) {
    return `${ activity.name } - ${ activity.distance }m`;
  }

  const duration = getEstimatedDuration(activity);
  return `${ activity.name } - ${ duration }min`;
}

/**
 * QUERY: Get detailed description.
 */
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

  if (activityRequiresEquipment(activity)) {
    desc += `\nEquipment: ${ activity.equipment!.join(', ') }`;
  }

  return desc;
}

/**
 * QUERY: Get instructions list.
 */
export function getInstructionsList(activity: WorkoutActivity): string[] {
  const instructions: string[] = [];

  if (activity.instructions) {
    instructions.push(...activity.instructions);
  }

  if (activity.structure) {
    const { getDescription } = require('../activity-structure/activity-structure.queries.js');
    instructions.push(getDescription(activity.structure));
  }

  return instructions;
}
