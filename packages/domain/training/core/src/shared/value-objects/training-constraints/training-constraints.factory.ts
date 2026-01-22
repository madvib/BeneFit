import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError, VALID_DAYS } from '@bene/shared';
import {
  TrainingConstraints,
  TrainingConstraintsSchema,
} from './training-constraints.types.js';

/**
 * ============================================================================
 * TRAINING CONSTRAINTS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. trainingConstraintsFromPersistence() - For fixtures & DB hydration
 * 2. CreateTrainingConstraintsSchema - Zod transform for API boundaries
 * 3. Specialized factories (createHomeTrainingConstraints, etc.)
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands data with TrainingConstraintsSchema and business rules */
function validateAndBrand(data: unknown): Result<TrainingConstraints> {
  const parseResult = TrainingConstraintsSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain Rule: Must have at least one available day
  if (validated.availableDays.length === 0) {
    return Result.fail(new Error('Must have at least one available day'));
  }

  // Domain Rule: Days must be valid
  for (const day of validated.availableDays) {
    if (!VALID_DAYS.includes(day)) {
      return Result.fail(new Error(`Invalid day: ${ day }. Must be one of: ${ VALID_DAYS.join(', ') }`));
    }
  }

  // Domain Rule: No duplicate days
  const uniqueDays = new Set(validated.availableDays);
  if (uniqueDays.size !== validated.availableDays.length) {
    return Result.fail(new Error('Duplicate days in available days'));
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates TrainingConstraints from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function trainingConstraintsFromPersistence(
  data: Unbrand<TrainingConstraints>,
): Result<TrainingConstraints> {
  return Result.ok(data as TrainingConstraints);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating new TrainingConstraints.
 * Use at API boundaries (controllers, resolvers).
 */
export const CreateTrainingConstraintsSchema: z.ZodType<TrainingConstraints> = TrainingConstraintsSchema.transform(
  (input, ctx) => {
    const result = validateAndBrand(input);
    return unwrapOrIssue(result, ctx);
  },
);

// ============================================================================
// 3. SPECIALIZED FACTORIES
// ============================================================================

export function createHomeTrainingConstraints(
  availableDays: string[],
  equipment: string[] = [],
): Result<TrainingConstraints> {
  return validateAndBrand({
    availableDays,
    availableEquipment: equipment,
    location: 'home',
  });
}

export function createGymTrainingConstraints(
  availableDays: string[],
  maxDuration: number,
): Result<TrainingConstraints> {
  return validateAndBrand({
    availableDays,
    maxDuration,
    availableEquipment: [],
    location: 'gym',
  });
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================


