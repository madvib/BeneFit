import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  UserPreferencesSchema,
  CreateUserPreferencesSchema,
  UserStatsSchema,
  CreateUserStatsSchema,
} from '@/user-profile/value-objects/index.js';

import { UserProfile, UserProfileSchema } from './user-profile.types.js';

/**
 * ============================================================================
 * USER PROFILE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. userProfileFromPersistence() - For fixtures & DB hydration
 * 2. CreateUserProfileSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (DRY)
// ============================================================================

/** Validates and brands data with UserProfileSchema */
function validateAndBrand(data: unknown): Result<UserProfile> {
  const parseResult = UserProfileSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION FACTORY (FROM PERSISTENCE)
// ============================================================================

/**
 * Rehydrates UserProfile from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function userProfileFromPersistence(
  data: Unbrand<UserProfile>,
): Result<UserProfile> {
  return Result.ok(data as UserProfile);
}

// ============================================================================
// 2. CREATION FACTORY (FOR API BOUNDARIES)
// ============================================================================

/**
 * Zod transform for creating UserProfile with validation.
 * Use at API boundaries (controllers, resolvers).
 */
export const CreateUserProfileSchema: z.ZodType<UserProfile> = UserProfileSchema
  .pick({
    userId: true,
    displayName: true,
    avatar: true,
    bio: true,
    location: true,
    timezone: true,
    experienceProfile: true,
    fitnessGoals: true,
    trainingConstraints: true,
  })
  .extend({
    preferences: UserPreferencesSchema.optional(),
    stats: UserStatsSchema.optional(),
    createdAt: z.coerce.date<Date>().optional(),
    updatedAt: z.coerce.date<Date>().optional(),
    lastActiveAt: z.coerce.date<Date>().optional(),
  })
  .transform((input, ctx) => {
    const now = new Date();

    const data = {
      ...input,
      preferences: input.preferences || CreateUserPreferencesSchema.parse({}),
      stats: input.stats || CreateUserStatsSchema.parse({ joinedAt: now }),
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || now,
      lastActiveAt: input.lastActiveAt || now,
    };

    const result = validateAndBrand(data);
    return unwrapOrIssue(result, ctx);
  });

// ============================================================================
// LEGACY EXPORTS (FOR BACKWARD COMPATIBILITY)
// ============================================================================

/**
 * @deprecated Use CreateUserProfileSchema or call via transform.
 */

