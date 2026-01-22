import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { UserStats, UserStatsSchema } from './user-stats.types.js';

/**
 * ============================================================================
 * USER STATS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. userStatsFromPersistence() - For fixtures & DB hydration
 * 2. CreateUserStatsSchema - Zod transform for API boundaries (Creation)
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands UserStats */
function validateUserStats(data: unknown): Result<UserStats> {
  const parseResult = UserStatsSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates UserStats from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function userStatsFromPersistence(
  data: Unbrand<UserStats>,
): Result<UserStats> {
  return Result.ok(data as UserStats);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating initial UserStats for a new user.
 * Input: Only the joinedAt date is needed (wrapped in an object).
 * 
 * Infer input type with: z.input<typeof CreateUserStatsSchema>
 * TODO perhaps call this initialize instead of create? 
 */
export const CreateUserStatsSchema: z.ZodType<UserStats> = z.object({
  joinedAt: z.coerce.date<Date>(),
}).transform((input, ctx) => {
  // Initial state logic
  const data = {
    totalWorkouts: 0,
    totalMinutes: 0,
    totalVolume: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    firstWorkoutDate: input.joinedAt,
    joinedAt: input.joinedAt,
    lastWorkoutDate: undefined,
  };

  const validationResult = validateUserStats(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================
