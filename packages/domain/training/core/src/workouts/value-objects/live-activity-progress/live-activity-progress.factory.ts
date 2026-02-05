import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError, Guard } from '@bene/shared';
import { LiveActivityProgress, LiveActivityProgressSchema } from './live-activity-progress.types.js';

/**
 * ============================================================================
 * LIVE ACTIVITY PROGRESS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. liveActivityProgressFromPersistence() - For fixtures & DB hydration
 * 2. CreateLiveActivityProgressSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates LiveActivityProgress with domain-specific business rules */
function validateLiveActivityProgress(data: unknown): Result<LiveActivityProgress> {
  // 1. Parse with Zod schema
  const parseResult = LiveActivityProgressSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // 2. Cross-field domain validation: activityIndex must be within range
  const guardResult = Guard.inRange(
    validated.activityIndex,
    0,
    validated.totalActivities - 1,
    'activityIndex'
  );

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  // 3. Return branded entity
  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates LiveActivityProgress from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function liveActivityProgressFromPersistence(
  data: Unbrand<LiveActivityProgress>,
): Result<LiveActivityProgress> {
  return Result.ok(data as LiveActivityProgress);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating LiveActivityProgress with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateLiveActivityProgressSchema>
 */
export const CreateLiveActivityProgressSchema = LiveActivityProgressSchema.pick({
  activityType: true,
  activityIndex: true,
  totalActivities: true,
  intervalProgress: true,
  exerciseProgress: true,
}).extend({
  activityStartedAt: z.coerce.date<Date>().optional(),
  elapsedSeconds: z.number().int().min(0).optional(),
}).transform((input, ctx) => {
  // Build entity with defaults
  const data = {
    ...input,
    activityStartedAt: input.activityStartedAt || new Date(),
    elapsedSeconds: input.elapsedSeconds || 0,
  };

  // Validate and brand
  const validationResult = validateLiveActivityProgress(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<LiveActivityProgress>;


