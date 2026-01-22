import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  TemplateStructure,
  TemplateStructureSchema,
} from './template-structure.types.js';

/**
 * ============================================================================
 * TEMPLATE STRUCTURE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. templateStructureFromPersistence() - For fixtures & DB hydration
 * 2. CreateTemplateStructureSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates TemplateStructure with domain-specific business rules */
function validateTemplateStructure(data: unknown): Result<TemplateStructure> {
  const parseResult = TemplateStructureSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Cross-field Domain Validation Logic

  // 1. Validate Duration Range
  if (validated.duration.type === 'variable') {
    if (validated.duration.min > validated.duration.max) {
      return Result.fail(new Error('duration.min must be <= duration.max'));
    }
  }

  // 2. Validate Frequency Range
  if (validated.frequency.type === 'flexible') {
    if (validated.frequency.min > validated.frequency.max) {
      return Result.fail(new Error('frequency.min must be <= frequency.max'));
    }
  }

  // 3. Validate Weeks consistency
  if (validated.weeks.length === 0) {
    return Result.fail(new Error('weeks array cannot be empty'));
  }

  for (const week of validated.weeks) {
    if (week.workouts.length === 0) {
      return Result.fail(new Error(`week ${ week.weekNumber } must have at least one workout`));
    }

    for (const workout of week.workouts) {
      if (workout.activities.length === 0) {
        return Result.fail(new Error('workout must have at least one activity'));
      }
    }
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates TemplateStructure from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function templateStructureFromPersistence(
  data: Unbrand<TemplateStructure>,
): Result<TemplateStructure> {
  return Result.ok(data as TemplateStructure);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating TemplateStructure with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateTemplateStructureSchema>
 */
export const CreateTemplateStructureSchema: z.ZodType<TemplateStructure> = TemplateStructureSchema.transform((input, ctx) => {
  const validationResult = validateTemplateStructure(input);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility in tests)
// ============================================================================

/**
 * @deprecated Use CreateTemplateStructureSchema or call via transform.
 * Kept for test compatibility.
 */

