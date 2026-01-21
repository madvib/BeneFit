import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError, EXPERIENCE_LEVELS } from '@bene/shared';
import { TemplateRules, TemplateRulesSchema } from './template-rules.types.js';

/**
 * ============================================================================
 * TEMPLATE RULES FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. templateRulesFromPersistence() - For fixtures & DB hydration
 * 2. CreateTemplateRulesSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates TemplateRules with domain-specific business rules */
function validateTemplateRules(data: unknown): Result<TemplateRules> {
  const parseResult = TemplateRulesSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain Rule: minExperienceLevel <= maxExperienceLevel
  const minIdx = EXPERIENCE_LEVELS.indexOf(validated.minExperienceLevel);
  const maxIdx = EXPERIENCE_LEVELS.indexOf(validated.maxExperienceLevel);

  if (minIdx > maxIdx) {
    return Result.fail(new Error('minExperienceLevel must be <= maxExperienceLevel'));
  }

  // Domain Rule: restrictions range validation
  if (validated.restrictions) {
    const { minSessionMinutes, maxSessionMinutes } = validated.restrictions;
    if (minSessionMinutes && maxSessionMinutes && minSessionMinutes > maxSessionMinutes) {
      return Result.fail(new Error('minSessionMinutes must be <= maxSessionMinutes'));
    }
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates TemplateRules from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function templateRulesFromPersistence(
  data: Unbrand<TemplateRules>,
): Result<TemplateRules> {
  return Result.ok(data as TemplateRules);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating TemplateRules with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateTemplateRulesSchema>
 */
export const CreateTemplateRulesSchema: z.ZodType<TemplateRules> = TemplateRulesSchema.transform((input, ctx) => {
  const validationResult = validateTemplateRules(input);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility in tests)
// ============================================================================

/**
 * @deprecated Use CreateTemplateRulesSchema or call via transform.
 * Kept for test compatibility.
 */
export function createTemplateRules(
  params: z.infer<typeof TemplateRulesSchema>,
): Result<TemplateRules> {
  return validateTemplateRules(params);
}
