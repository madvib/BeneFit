import { z } from 'zod';
import { Result, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  WorkoutGoals,
  WorkoutGoalsSchema,
  CompletionCriteria,
} from './workout-goals.types.js';

/**
 * ============================================================================
 * WORKOUT GOALS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. workoutGoalsFromPersistence() - For fixtures & DB hydration
 * 2. CreateWorkoutGoalsSchema - Zod transform for API boundaries
 * 3. Specialized factories (createDistanceWorkout, etc.)
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates data with WorkoutGoalsSchema and business rules */
function validate(data: unknown): Result<WorkoutGoals> {
  const parseResult = WorkoutGoalsSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Business Rule: Exactly one goal type must be specified
  const goalTypes = [
    validated.distance ? 1 : 0,
    validated.duration ? 1 : 0,
    validated.volume ? 1 : 0,
  ].filter(Boolean).length;

  if (goalTypes === 0) {
    return Result.fail(new Error('At least one goal type (distance, duration, or volume) must be specified'));
  }

  if (goalTypes > 1) {
    return Result.fail(new Error('Only one goal type (distance, duration, or volume) can be specified'));
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WorkoutGoals from persistence/fixtures (trusts the data).
 */
export function workoutGoalsFromPersistence(data: WorkoutGoals): Result<WorkoutGoals> {
  return Result.ok(data);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating new WorkoutGoals.
 * Use at API boundaries (controllers, resolvers).
 */
export const CreateWorkoutGoalsSchema: z.ZodType<WorkoutGoals> = WorkoutGoalsSchema.transform((input, ctx) => {
  const result = validate(input);
  return unwrapOrIssue(result, ctx);
});

// ============================================================================
// 3. SPECIALIZED FACTORIES
// ============================================================================

export function createDistanceWorkout(
  distance: number,
  unit: 'meters' | 'km' | 'miles',
  criteria: CompletionCriteria,
): Result<WorkoutGoals> {
  return validate({
    distance: { value: distance, unit },
    completionCriteria: criteria,
  });
}

export function createDurationWorkout(
  duration: number,
  criteria: CompletionCriteria,
  intensity?: 'easy' | 'moderate' | 'hard' | 'max',
): Result<WorkoutGoals> {
  return validate({
    duration: { value: duration, intensity },
    completionCriteria: criteria,
  });
}

export function createVolumeWorkout(
  totalSets: number,
  totalReps: number,
  criteria: CompletionCriteria,
): Result<WorkoutGoals> {
  return validate({
    volume: { totalSets, totalReps },
    completionCriteria: criteria,
  });
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================


