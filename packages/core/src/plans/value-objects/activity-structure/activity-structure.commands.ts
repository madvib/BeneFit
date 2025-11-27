import { Result } from '@shared';
import { ActivityStructure, IntensityLevel, Interval, Exercise } from './activity-structure.types.js';

// Type checking functions
export function isIntervalBased(structure: ActivityStructure): boolean {
  return structure.intervals !== undefined && structure.intervals.length > 0;
}

export function isExerciseBased(structure: ActivityStructure): boolean {
  return structure.exercises !== undefined && structure.exercises.length > 0;
}

export function isEmpty(structure: ActivityStructure): boolean {
  return !isIntervalBased(structure) && !isExerciseBased(structure);
}

// Calculation functions
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
      const exerciseDuration = exercise.duration
        ? exercise.duration * exercise.sets
        : 0; // If no duration, assume it's rep-based and we don't know time
      const totalRest = exercise.rest * (exercise.sets - 1);
      return total + exerciseDuration + totalRest;
    }, 0);
    return singleRoundDuration * (structure.rounds || 1);
  }

  return 0;
}

export function getTotalSets(structure: ActivityStructure): number {
  if (!isExerciseBased(structure)) {
    return 0;
  }

  return structure.exercises!.reduce(
    (total, exercise) => total + exercise.sets,
    0
  ) * (structure.rounds || 1);
}

// Transformation functions - Return new instances (immutable)
export function withAdjustedDuration(structure: ActivityStructure, durationAdjustment: number): ActivityStructure {
  if (isIntervalBased(structure)) {
    const adjustedIntervals = structure.intervals!.map(interval => ({
      ...interval,
      duration: Math.max(1, Math.round(interval.duration * durationAdjustment)),
    }));

    return {
      ...structure,
      intervals: adjustedIntervals,
    };
  }

  if (isExerciseBased(structure)) {
    const adjustedExercises = structure.exercises!.map(exercise => ({
      ...exercise,
      duration: exercise.duration
        ? Math.max(1, Math.round(exercise.duration * durationAdjustment))
        : undefined,
    }));

    return {
      ...structure,
      exercises: adjustedExercises,
    };
  }

  return structure;
}

export function withAdjustedIntensity(structure: ActivityStructure, intensityFactor: number): ActivityStructure {
  if (intensityFactor <= 0 || intensityFactor > 2) {
    return structure; // Invalid factor, return unchanged
  }

  if (isIntervalBased(structure)) {
    const adjustedIntervals = structure.intervals!.map(interval => {
      // Reduce intensity by increasing rest or reducing work time
      if (intensityFactor < 1) {
        // Easier: increase rest
        return {
          ...interval,
          rest: Math.round(interval.rest / intensityFactor),
        };
      } else {
        // Harder: decrease rest
        return {
          ...interval,
          rest: Math.max(0, Math.round(interval.rest * (2 - intensityFactor))),
        };
      }
    });

    return {
      ...structure,
      intervals: adjustedIntervals,
    };
  }

  if (isExerciseBased(structure)) {
    const adjustedExercises = structure.exercises!.map(exercise => {
      // Adjust weight if present
      if (exercise.weight !== undefined) {
        return {
          ...exercise,
          weight: Math.round(exercise.weight * intensityFactor * 10) / 10, // Round to 1 decimal
        };
      }
      // Adjust reps if numeric
      if (typeof exercise.reps === 'number') {
        return {
          ...exercise,
          reps: Math.max(1, Math.round(exercise.reps * intensityFactor)),
        };
      }
      return exercise;
    });

    return {
      ...structure,
      exercises: adjustedExercises,
    };
  }

  return structure;
}

export function withAdditionalRounds(structure: ActivityStructure, additionalRounds: number): ActivityStructure {
  if (additionalRounds < 0) {
    return structure;
  }

  const currentRounds = structure.rounds || 1;
  return {
    ...structure,
    rounds: currentRounds + additionalRounds,
  };
}

export function withFewerRounds(structure: ActivityStructure, rounds: number): ActivityStructure {
  if (rounds <= 0) {
    return structure;
  }

  return {
    ...structure,
    rounds: Math.min(rounds, structure.rounds || 1),
  };
}

export function withIncreasedRest(structure: ActivityStructure, restMultiplier: number): ActivityStructure {
  if (restMultiplier <= 0) {
    return structure;
  }

  if (isIntervalBased(structure)) {
    const adjustedIntervals = structure.intervals!.map(interval => ({
      ...interval,
      rest: Math.round(interval.rest * restMultiplier),
    }));

    return {
      ...structure,
      intervals: adjustedIntervals,
    };
  }

  if (isExerciseBased(structure)) {
    const adjustedExercises = structure.exercises!.map(exercise => ({
      ...exercise,
      rest: Math.round(exercise.rest * restMultiplier),
    }));

    return {
      ...structure,
      exercises: adjustedExercises,
    };
  }

  return structure;
}

// Query functions
export function getAverageIntensity(structure: ActivityStructure): number {
  if (isIntervalBased(structure)) {
    const intensityMap: Record<IntensityLevel, number> = {
      easy: 1,
      moderate: 2,
      hard: 3,
      sprint: 4,
    };

    const totalIntensity = structure.intervals!.reduce(
      (sum, interval) => sum + intensityMap[interval.intensity],
      0
    );

    return totalIntensity / structure.intervals!.length;
  }

  return 2; // Default moderate
}

export function requiresEquipment(structure: ActivityStructure): boolean {
  if (!isExerciseBased(structure)) {
    return false;
  }

  // Simple heuristic: if weight is specified, likely needs equipment
  return structure.exercises!.some(exercise => exercise.weight !== undefined);
}

// Display helpers
export function getDescription(structure: ActivityStructure): string {
  if (isIntervalBased(structure)) {
    const rounds = structure.rounds || 1;
    const intervalCount = structure.intervals!.length;
    return `${rounds} round${rounds > 1 ? 's' : ''} of ${intervalCount} interval${intervalCount > 1 ? 's' : ''}`;
  }

  if (isExerciseBased(structure)) {
    const rounds = structure.rounds || 1;
    const exerciseCount = structure.exercises!.length;
    return `${rounds} round${rounds > 1 ? 's' : ''} of ${exerciseCount} exercise${exerciseCount > 1 ? 's' : ''}`;
  }

  return 'No structure defined';
}

// Equality function
export function equals(structure: ActivityStructure, other: ActivityStructure): boolean {
  if (!other) return false;

  // Deep comparison
  return JSON.stringify(structure) === JSON.stringify(other);
}