import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { WorkoutPerformance, WorkoutPerformanceSchema } from './workout-performance.types.js';

/**
 * ============================================================================
 * WORKOUT PERFORMANCE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. workoutPerformanceFromPersistence() - For fixtures & DB hydration
 * 2. CreateWorkoutPerformanceSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates WorkoutPerformance with domain-specific business rules */
function validateWorkoutPerformance(data: unknown): Result<WorkoutPerformance> {
  // Parse with Zod schema
  const parseResult = WorkoutPerformanceSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain Invariants
  if (validated.completedAt < validated.startedAt) {
    return Result.fail(new Error('completedAt must be after startedAt'));
  }

  if (validated.activities.length === 0) {
    return Result.fail(new Error('must have at least one activity'));
  }

  // Deep validation of exercises
  for (const activity of validated.activities) {
    if (activity.exercises) {
      for (const exercise of activity.exercises) {
        if (exercise.reps && exercise.reps.length !== exercise.setsCompleted) {
          return Result.fail(new Error(`reps array length must match setsCompleted for exercise: ${ exercise.name }`));
        }
        if (exercise.weight && exercise.weight.length !== exercise.setsCompleted) {
          return Result.fail(new Error(`weight array length must match setsCompleted for exercise: ${ exercise.name }`));
        }
      }
    }
  }

  if (validated.heartRate) {
    if (validated.heartRate.average !== undefined && validated.heartRate.max !== undefined) {
      if (validated.heartRate.average > validated.heartRate.max) {
        return Result.fail(new Error('Average heart rate cannot be greater than max heart rate'));
      }
    }
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WorkoutPerformance from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function workoutPerformanceFromPersistence(
  data: Unbrand<WorkoutPerformance>,
): Result<WorkoutPerformance> {
  return Result.ok(data as WorkoutPerformance);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating WorkoutPerformance with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateWorkoutPerformanceSchema>
 */
export const CreateWorkoutPerformanceSchema = WorkoutPerformanceSchema.omit({
  durationMinutes: true,
}).extend({
  durationMinutes: z.number().optional(),
}).transform((input, ctx) => {
  // Calculate duration from timestamps
  const durationMs = input.completedAt.getTime() - input.startedAt.getTime();
  const calculatedDurationMinutes = Math.round(durationMs / 60000);

  // Build entity with defaults
  const data = {
    ...input,
    durationMinutes: input.durationMinutes ?? calculatedDurationMinutes,
  };

  // Validate and brand
  const validationResult = validateWorkoutPerformance(data);
  return unwrapOrIssue(validationResult, ctx);
});


