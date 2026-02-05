import { IntensityLevel } from '@/shared/index.js';
import type { ActivityStructure } from './activity-structure.types.js';

/**
 * QUERY: Check if structure is interval-based.
 */
export function isIntervalBased(structure: ActivityStructure): boolean {
  return structure.intervals !== undefined && structure.intervals.length > 0;
}

/**
 * QUERY: Check if structure is exercise-based.
 */
export function isExerciseBased(structure: ActivityStructure): boolean {
  return structure.exercises !== undefined && structure.exercises.length > 0;
}

/**
 * QUERY: Check if structure is empty.
 */
export function isEmpty(structure: ActivityStructure): boolean {
  return !isIntervalBased(structure) && !isExerciseBased(structure);
}

/**
 * QUERY: Calculate total duration in seconds.
 */
export function getTotalDuration(structure: ActivityStructure): number {
  if (isIntervalBased(structure)) {
    const singleRoundDuration = structure.intervals!.reduce(
      (total, interval) => total + interval.duration + interval.rest,
      0
    );
    return singleRoundDuration * (structure.rounds || 1);
  }

  if (isExerciseBased(structure)) {
    const singleRoundDuration = structure.exercises!.reduce((total, exercise) => {
      let exerciseDuration = 0;
      if (exercise.duration) {
        // For timed exercises
        exerciseDuration = exercise.duration * exercise.sets;
      } else if (exercise.reps) {
        // For rep-based exercises, estimate duration
        // 2 seconds per rep is a common estimate (adjust as needed)
        const repsPerSet = typeof exercise.reps === 'number' ? exercise.reps : 10; // Default to 10 if "to failure"
        exerciseDuration = (repsPerSet * 2) * exercise.sets; // 2 seconds per rep
      }
      const totalRest = exercise.rest * (exercise.sets - 1);
      return total + exerciseDuration + totalRest;
    }, 0);
    return singleRoundDuration * (structure.rounds || 1);
  }

  return 0;
}

/**
 * QUERY: Calculate total sets (for exercise-based structures).
 */
export function getTotalSets(structure: ActivityStructure): number {
  if (!isExerciseBased(structure)) {
    return 0;
  }

  return (
    structure.exercises!.reduce((total, exercise) => total + exercise.sets, 0) * (structure.rounds || 1)
  );
}

/**
 * QUERY: Calculate average intensity (for interval-based structures).
 */
export function getAverageIntensity(structure: ActivityStructure): number {
  if (isIntervalBased(structure)) {
    const intensityMap: Record<IntensityLevel, number> = {
      easy: 1,
      moderate: 2,
      hard: 3,
      sprint: 4,
      max: 5,
    };

    const totalIntensity = structure.intervals!.reduce(
      (sum, interval) => sum + intensityMap[interval.intensity],
      0
    );

    return totalIntensity / structure.intervals!.length;
  }

  return 2; // Default moderate
}

/**
 * QUERY: Check if structure requires equipment.
 */
export function requiresEquipment(structure: ActivityStructure): boolean {
  if (!isExerciseBased(structure)) {
    return false;
  }

  // Simple heuristic: if weight is specified, likely needs equipment
  return structure.exercises!.some((exercise) => exercise.weight !== undefined);
}

/**
 * QUERY: Get human-readable description.
 */
export function getDescription(structure: ActivityStructure): string {
  if (isIntervalBased(structure)) {
    const rounds = structure.rounds || 1;
    const intervalCount = structure.intervals!.length;
    return `${ rounds } round${ rounds > 1 ? 's' : '' } of ${ intervalCount } interval${ intervalCount > 1 ? 's' : '' }`;
  }

  if (isExerciseBased(structure)) {
    const rounds = structure.rounds || 1;
    const exerciseCount = structure.exercises!.length;
    return `${ rounds } round${ rounds > 1 ? 's' : '' } of ${ exerciseCount } exercise${ exerciseCount > 1 ? 's' : '' }`;
  }

  return 'No structure defined';
}
