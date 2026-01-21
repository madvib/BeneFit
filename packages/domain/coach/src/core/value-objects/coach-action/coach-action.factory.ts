import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CoachAction, CoachActionSchema } from './coach-action.types.js';

/**
 * ============================================================================
 * COACH ACTION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. coachActionFromPersistence() - For fixtures & DB hydration
 * 2. CreateCoachActionSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands CoachAction */
function validateCoachAction(data: unknown): Result<CoachAction> {
  const parseResult = CoachActionSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates CoachAction from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function coachActionFromPersistence(
  data: Unbrand<CoachAction>,
): Result<CoachAction> {
  return Result.ok(data as CoachAction);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating CoachAction with validation.
 */
export const CreateCoachActionSchema = CoachActionSchema.pick({
  type: true,
  details: true,
  planChangeId: true,
}).extend({
  appliedAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const data = {
    ...input,
    appliedAt: input.appliedAt || new Date(),
  };

  const validationResult = validateCoachAction(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CoachAction>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateCoachActionSchema or coachActionFromPersistence.
 */
export function createCoachAction(
  params: z.input<typeof CreateCoachActionSchema>,
): Result<CoachAction> {
  const result = CreateCoachActionSchema.safeParse(params);
  if (!result.success) {
    return Result.fail(mapZodError(result.error));
  }
  return Result.ok(result.data);
}
