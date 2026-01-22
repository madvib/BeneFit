import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { ActivityValidationError } from '../../errors/workout-errors.js';
import {
  isIntervalBased,
  isExerciseBased,
  getTotalDuration
} from '../activity-structure/activity-structure.queries.js';
import { ActivityStructure } from '../activity-structure/index.js';
import { WorkoutActivity, WorkoutActivitySchema } from './workout-activity.types.js';

/**
 * ============================================================================
 * WORKOUT ACTIVITY FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. workoutActivityFromPersistence() - For fixtures & DB hydration
 * 2. CreateWorkoutActivitySchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates WorkoutActivity with domain-specific business rules */
function validateWorkoutActivity(data: unknown): Result<WorkoutActivity> {
  // Parse with Zod schema
  const parseResult = WorkoutActivitySchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain validation: order must be >= 0
  if (validated.order < 0) {
    return Result.fail(new ActivityValidationError('Order must be >= 0', { order: validated.order }));
  }

  // Return branded entity
  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WorkoutActivity from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function workoutActivityFromPersistence(
  data: Unbrand<WorkoutActivity>,
): Result<WorkoutActivity> {
  return Result.ok(data as WorkoutActivity);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating WorkoutActivity with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateWorkoutActivitySchema>
 */
export const CreateWorkoutActivitySchema = WorkoutActivitySchema.pick({
  name: true,
  type: true,
  order: true,
  structure: true,
  instructions: true,
  distance: true,
  duration: true,
  pace: true,
  videoUrl: true,
  equipment: true,
  alternativeExercises: true,
}).transform((input, ctx) => {
  // Build entity with defaults
  const data = {
    ...input,
    instructions: input.instructions || [],
    equipment: input.equipment || [],
    alternativeExercises: input.alternativeExercises || [],
  };

  // Validate and brand
  const validationResult = validateWorkoutActivity(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<WorkoutActivity>;


