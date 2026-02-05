import { z } from 'zod';

import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CompletedWorkout, CompletedWorkoutSchema } from './completed-workout.types.js';

/**
 * ============================================================================
 * COMPLETED WORKOUT FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. completedWorkoutFromPersistence() - For fixtures & DB hydration
 * 2. CreateCompletedWorkoutSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands CompletedWorkout */
function validateCompletedWorkout(data: unknown): Result<CompletedWorkout> {
  const parseResult = CompletedWorkoutSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates CompletedWorkout from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function completedWorkoutFromPersistence(
  data: Unbrand<CompletedWorkout>,
): Result<CompletedWorkout> {
  return Result.ok(data as CompletedWorkout);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating CompletedWorkout with domain validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateCompletedWorkoutSchema>
 */
export const CreateCompletedWorkoutSchema = CompletedWorkoutSchema.pick({
  userId: true,
  workoutType: true,
  performance: true,
  verification: true,
  planId: true,
  workoutTemplateId: true,
  weekNumber: true,
  dayNumber: true,
  multiplayerSessionId: true,
  isPublic: true,
}).extend({
  id: z.uuid().optional(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  createdAt: z.coerce.date<Date>().optional(),
  recordedAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const now = new Date();

  // Default Title Logic: Capitalize workout type
  const defaultTitle = String(input.workoutType).charAt(0).toUpperCase() + String(input.workoutType).slice(1);

  const data = {
    ...input,
    id: input.id || crypto.randomUUID(),
    title: input.title || defaultTitle,
    description: input.description,
    reactions: [],
    isPublic: input.isPublic ?? false,
    createdAt: input.createdAt || now,
    recordedAt: input.recordedAt || input.performance?.completedAt || now,
  };

  // Validate and brand
  const validationResult = validateCompletedWorkout(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CompletedWorkout>;


