import { z } from 'zod';
import { Result, unwrapOrIssue, mapZodError } from '@bene/shared';
import { PlanPosition, PlanPositionSchema } from './plan-position.types.js';

/**
 * ============================================================================
 * PLAN POSITION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. planPositionFromPersistence() - For fixtures & DB hydration
 * 2. CreatePlanPositionSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates data with PlanPositionSchema */
function validate(data: unknown): Result<PlanPosition> {
  const parseResult = PlanPositionSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }
  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates PlanPosition from persistence/fixtures (trusts the data).
 */
export function planPositionFromPersistence(data: PlanPosition): Result<PlanPosition> {
  return Result.ok(data);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating new PlanPosition.
 * Use at API boundaries (controllers, resolvers).
 */
export const CreatePlanPositionSchema: z.ZodType<PlanPosition> = PlanPositionSchema.transform((input, ctx) => {
  const result = validate(input);
  return unwrapOrIssue(result, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================


