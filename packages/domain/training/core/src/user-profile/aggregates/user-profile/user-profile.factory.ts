import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CreateTrainingConstraintsSchema } from '@/shared/index.js';
import {
  UserPreferencesSchema,
  CreateUserPreferencesSchema,
  UserStatsSchema,
  CreateUserStatsSchema,
  CreateExperienceProfileSchema,
  CreateFitnessGoalsSchema,
  ExperienceProfileSchema,
  FitnessGoalsSchema,
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
export function userProfileFromPersistence(data: Unbrand<UserProfile>): Result<UserProfile> {
  return Result.ok(data as UserProfile);
}

// ============================================================================
// 2. CREATION FACTORY (FOR API BOUNDARIES)
// ============================================================================
export type CreateUserProfileInput = z.infer<typeof CreateUserProfileSchema>;
export const CreateUserProfileSchema = UserProfileSchema.pick({
  userId: true,
  displayName: true,
  avatar: true,
  bio: true,
  location: true,
  timezone: true,
})
  .extend({
    experienceProfile: CreateExperienceProfileSchema.optional(),
    fitnessGoals: CreateFitnessGoalsSchema.optional(),
    trainingConstraints: CreateTrainingConstraintsSchema.optional(),
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
      experienceProfile:
        input.experienceProfile ||
        CreateExperienceProfileSchema.parse({
          level: 'beginner',
          capabilities: {
            canDoFullPushup: false,
            canDoFullPullup: false,
            canRunMile: false,
            canSquatBelowParallel: false,
          },
        }),
      fitnessGoals:
        input.fitnessGoals ||
        CreateFitnessGoalsSchema.parse({
          primary: 'strength',
          secondary: [],
          motivation: 'Improve overall health',
          successCriteria: [],
        }),
      trainingConstraints:
        input.trainingConstraints ||
        CreateTrainingConstraintsSchema.parse({
          location: 'mixed',
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          availableEquipment: [],
          maxDuration: 60,
          injuries: [],
        }),
      preferences: input.preferences || CreateUserPreferencesSchema.parse({}),
      stats: input.stats || CreateUserStatsSchema.parse({ joinedAt: now }),
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || now,
      lastActiveAt: input.lastActiveAt || now,
    };

    const result = validateAndBrand(data);
    return unwrapOrIssue(result, ctx);
  }) satisfies z.ZodType<UserProfile>;
