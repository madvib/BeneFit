import { z } from 'zod';
import { Result, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  ProgressionStrategy,
  ProgressionStrategySchema,
} from './progression-strategy.types.js';

/**
 * ============================================================================
 * PROGRESSION STRATEGY FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. progressionStrategyFromPersistence() - For fixtures & DB hydration
 * 2. CreateProgressionStrategySchema - Zod transform for API boundaries
 * 3. Specialized factories (createLinearProgression, etc.)
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates data with ProgressionStrategySchema */
function validate(data: unknown): Result<ProgressionStrategy> {
  const parseResult = ProgressionStrategySchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }
  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates ProgressionStrategy from persistence/fixtures (trusts the data).
 */
export function progressionStrategyFromPersistence(
  data: ProgressionStrategy,
): Result<ProgressionStrategy> {
  return Result.ok(data);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating new ProgressionStrategy.
 * Use at API boundaries (controllers, resolvers).
 */
export const CreateProgressionStrategySchema: z.ZodType<ProgressionStrategy> = ProgressionStrategySchema.transform(
  (input, ctx) => {
    const result = validate(input);
    return unwrapOrIssue(result, ctx);
  },
);

// ============================================================================
// 3. SPECIALIZED FACTORIES
// ============================================================================

/**
 * Creates a linear progression strategy.
 */
export function createLinearProgression(
  weeklyIncrease: number,
  deloadFrequency: number = 4,
): Result<ProgressionStrategy> {
  // Generate deload weeks at the specified frequency, capped at week 52
  const deloadWeeks = Array.from({ length: 52 }, (_, i) => (i + 1) * deloadFrequency).filter(
    (w) => w <= 52,
  );

  return validate({
    type: 'linear',
    weeklyIncrease,
    deloadWeeks,
    minIncrease: 0.025,
  });
}

/**
 * Creates an undulating progression strategy.
 */
export function createUndulatingProgression(
  weeklyIncrease: number,
): Result<ProgressionStrategy> {
  return validate({
    type: 'undulating',
    weeklyIncrease,
    testWeeks: [2, 4, 6, 8, 10, 12],
  });
}

/**
 * Creates an adaptive progression strategy.
 */
export function createAdaptiveProgression(
  weeklyIncrease: number,
  minIncrease: number = 0.02,
  maxIncrease: number = 0.08,
): Result<ProgressionStrategy> {
  return validate({
    type: 'adaptive',
    weeklyIncrease,
    minIncrease,
    maxIncrease,
    testWeeks: [3, 6, 9, 12, 15, 18],
  });
}

export function createConservativeProgression(): Result<ProgressionStrategy> {
  return createLinearProgression(0.025, 6);
}

export function createAggressiveProgression(): Result<ProgressionStrategy> {
  return createLinearProgression(0.075, 3);
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateProgressionStrategySchema or call via transform.
 */
export function createProgressionStrategy(props: unknown): Result<ProgressionStrategy> {
  return validate(props);
}
