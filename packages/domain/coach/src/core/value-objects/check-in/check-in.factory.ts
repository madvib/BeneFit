import { z } from 'zod';

import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CheckIn, CheckInSchema } from './check-in.types.js';

/**
 * ============================================================================
 * CHECK-IN FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. checkInFromPersistence() - For fixtures & DB hydration
 * 2. CreateCheckInSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands CheckIn */
function validateCheckIn(data: unknown): Result<CheckIn> {
  const parseResult = CheckInSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates CheckIn from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function checkInFromPersistence(
  data: Unbrand<CheckIn>,
): Result<CheckIn> {
  return Result.ok(data as CheckIn);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating CheckIn with validation.
 */
export const CreateCheckInSchema = CheckInSchema.pick({
  type: true,
  triggeredBy: true,
  question: true,
}).extend({
  id: z.uuid().optional(),
  createdAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const data = {
    ...input,
    id: input.id || crypto.randomUUID(),
    actions: [],
    status: 'pending' as const,
    createdAt: input.createdAt || new Date(),
  };

  const validationResult = validateCheckIn(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CheckIn>;

