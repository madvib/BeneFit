import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { StructureValidationError } from '../../errors/workout-errors.js';
import { ActivityStructure, ActivityStructureSchema, Interval, Exercise } from './activity-structure.types.js';

/**
 * ============================================================================
 * ACTIVITY STRUCTURE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. activityStructureFromPersistence() - For fixtures & DB hydration
 * 2. CreateActivityStructureSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates ActivityStructure with domain-specific business rules */
function validateActivityStructure(data: unknown): Result<ActivityStructure> {
  // 1. Parse with Zod schema
  const parseResult = ActivityStructureSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // 2. Cross-field domain validation: Can't have both intervals and exercises
  if (validated.intervals && validated.exercises) {
    return Result.fail(new StructureValidationError('Activity structure cannot have both intervals and exercises'));
  }

  // 3. Return branded entity
  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates ActivityStructure from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function activityStructureFromPersistence(
  data: Unbrand<ActivityStructure>,
): Result<ActivityStructure> {
  return Result.ok(data as ActivityStructure);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating ActivityStructure with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateActivityStructureSchema>
 */
export const CreateActivityStructureSchema: z.ZodType<ActivityStructure> = ActivityStructureSchema.transform(
  (input, ctx) => {
    // Validate and brand
    const validationResult = validateActivityStructure(input);
    return unwrapOrIssue(validationResult, ctx);
  },
);


