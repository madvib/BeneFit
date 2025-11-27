// activity-structure.commands.ts
import { ActivityStructure, Interval, Exercise } from './activity-structure.types.js';
import { isIntervalBased, isExerciseBased } from './activity-structure.queries.js';

/**
 * COMMAND: Adjust duration by a factor.
 */
export function adjustDuration(structure: ActivityStructure, durationAdjustment: number): ActivityStructure {
  if (isIntervalBased(structure)) {
    const adjustedIntervals = structure.intervals!.map((interval) => ({
      ...interval,
      duration: Math.max(1, Math.round(interval.duration * durationAdjustment)),
    }));

    return {
      ...structure,
      intervals: adjustedIntervals,
    };
  }

  if (isExerciseBased(structure)) {
    const adjustedExercises = structure.exercises!.map((exercise) => ({
      ...exercise,
      duration: exercise.duration ? Math.max(1, Math.round(exercise.duration * durationAdjustment)) : undefined,
    }));

    return {
      ...structure,
      exercises: adjustedExercises,
    };
  }

  return structure;
}

/**
 * COMMAND: Adjust intensity by a factor.
 */
export function adjustIntensity(structure: ActivityStructure, intensityFactor: number): ActivityStructure {
  if (intensityFactor <= 0 || intensityFactor > 2) {
    return structure; // Invalid factor, return unchanged
  }

  if (isIntervalBased(structure)) {
    const adjustedIntervals = structure.intervals!.map((interval) => {
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
    const adjustedExercises = structure.exercises!.map((exercise) => {
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

/**
 * COMMAND: Add additional rounds.
 */
export function addRounds(structure: ActivityStructure, additionalRounds: number): ActivityStructure {
  if (additionalRounds < 0) {
    return structure;
  }

  const currentRounds = structure.rounds || 1;
  return {
    ...structure,
    rounds: currentRounds + additionalRounds,
  };
}

/**
 * COMMAND: Reduce to fewer rounds.
 */
export function reduceRounds(structure: ActivityStructure, rounds: number): ActivityStructure {
  if (rounds <= 0) {
    return structure;
  }

  return {
    ...structure,
    rounds: Math.min(rounds, structure.rounds || 1),
  };
}

/**
 * COMMAND: Increase rest periods by a multiplier.
 */
export function increaseRest(structure: ActivityStructure, restMultiplier: number): ActivityStructure {
  if (restMultiplier <= 0) {
    return structure;
  }

  if (isIntervalBased(structure)) {
    const adjustedIntervals = structure.intervals!.map((interval) => ({
      ...interval,
      rest: Math.round(interval.rest * restMultiplier),
    }));

    return {
      ...structure,
      intervals: adjustedIntervals,
    };
  }

  if (isExerciseBased(structure)) {
    const adjustedExercises = structure.exercises!.map((exercise) => ({
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
