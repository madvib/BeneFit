import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  ExperienceProfile,
  ExperienceProfileSchema,
  TrainingHistorySchema
} from './experience-profile.types.js';

/**
 * ============================================================================
 * EXPERIENCE PROFILE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. experienceProfileFromPersistence() - For fixtures & DB hydration
 * 2. CreateExperienceProfileSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands ExperienceProfile */
function validateExperienceProfile(data: unknown): Result<ExperienceProfile> {
  const parseResult = ExperienceProfileSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates ExperienceProfile from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function experienceProfileFromPersistence(
  data: Unbrand<ExperienceProfile>,
): Result<ExperienceProfile> {
  return Result.ok(data as ExperienceProfile);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating ExperienceProfile with domain validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateExperienceProfileSchema>
 */
export const CreateExperienceProfileSchema: z.ZodType<ExperienceProfile> = ExperienceProfileSchema.pick({
  level: true,
  capabilities: true,
}).extend({
  history: TrainingHistorySchema.optional(),
  lastAssessmentDate: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  // Build the entity with defaults
  const data = {
    level: input.level,
    history: {
      yearsTraining: input.history?.yearsTraining,
      previousPrograms: input.history?.previousPrograms || [],
      sports: input.history?.sports || [],
      certifications: input.history?.certifications || [],
    },
    capabilities: input.capabilities,
    lastAssessmentDate: input.lastAssessmentDate || new Date(),
  };

  // Validate and brand
  const validationResult = validateExperienceProfile(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================


