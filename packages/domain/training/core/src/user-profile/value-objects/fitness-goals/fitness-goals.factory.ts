import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { FitnessGoals, FitnessGoalsSchema, TargetWeightSchema } from './fitness-goals.types.js';

/**
 * ============================================================================
 * FITNESS GOALS FACTORY (Canonical Pattern)
 * ============================================================================
 *
 * PUBLIC API (2 exports):
 * 1. fitnessGoalsFromPersistence() - For fixtures & DB hydration
 * 2. CreateFitnessGoalsSchema - Zod transform for API boundaries
 *
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands FitnessGoals */
function validateFitnessGoals(data: unknown): Result<FitnessGoals> {
  const parseResult = FitnessGoalsSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain Rule: targetDate must be in the future (optional)
  if (validated.targetDate && validated.targetDate <= new Date()) {
    return Result.fail(new Error('targetDate must be in the future'));
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates FitnessGoals from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function fitnessGoalsFromPersistence(data: Unbrand<FitnessGoals>): Result<FitnessGoals> {
  return Result.ok(data as FitnessGoals);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating FitnessGoals with domain validation.
 * Use at API boundaries (controllers, resolvers).
 *
 * Infer input type with: z.input<typeof CreateFitnessGoalsSchema>
 */
export const CreateFitnessGoalsSchema = FitnessGoalsSchema.pick({
  primary: true,
  motivation: true,
})
  .extend({
    secondary: z.array(z.string().min(1).max(100)).optional(),
    targetWeight: TargetWeightSchema.optional(),
    targetBodyFat: z.number().optional(),
    targetDate: z.coerce.date<Date>().optional(),
    successCriteria: z.array(z.string()).optional(),
  })
  .transform((input, ctx) => {
    // Build the entity with defaults
    const data = {
      primary: input.primary,
      motivation: input.motivation,
      secondary: input.secondary || [],
      targetWeight: input.targetWeight,
      targetBodyFat: input.targetBodyFat,
      targetDate: input.targetDate,
      successCriteria: input.successCriteria || [],
    };

    // Validate and brand
    const validationResult = validateFitnessGoals(data);
    return unwrapOrIssue(validationResult, ctx);
  }) satisfies z.ZodType<FitnessGoals>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================
