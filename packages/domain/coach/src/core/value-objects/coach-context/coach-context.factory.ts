import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CoachContext, CoachContextSchema } from './coach-context.types.js';

/**
 * ============================================================================
 * COACH CONTEXT FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. coachContextFromPersistence() - For fixtures & DB hydration
 * 2. CreateCoachContextSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands CoachContext */
function validateCoachContext(data: unknown): Result<CoachContext> {
  const parseResult = CoachContextSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates CoachContext from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function coachContextFromPersistence(
  data: Unbrand<CoachContext>,
): Result<CoachContext> {
  return Result.ok(data as CoachContext);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating CoachContext with validation.
 */
export const CreateCoachContextSchema = CoachContextSchema.transform((input, ctx) => {
  const validationResult = validateCoachContext(input);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CoachContext>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateCoachContextSchema or coachContextFromPersistence.
 */
export function createCoachContext(
  params: z.input<typeof CreateCoachContextSchema>,
): Result<CoachContext> {
  const result = CreateCoachContextSchema.safeParse(params);
  if (!result.success) {
    return Result.fail(mapZodError(result.error));
  }
  return Result.ok(result.data);
}
