import { z } from 'zod';
import { Result, unwrapOrIssue, mapZodError, Unbrand } from '@bene/shared';
import {
  PlanGoals,
  TargetLiftWeight,
  PlanGoalsSchema,
} from './plan-goals.types.js';

/**
 * ============================================================================
 * PLAN GOALS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. planGoalsFromPersistence() - For fixtures & DB hydration
 * 2. CreatePlanGoalsSchema - Zod transform for API boundaries
 * 3. Specialized factories (createEventTraining, etc.)
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands data with PlanGoalsSchema and business rules */
function validateAndBrand(data: unknown): Result<PlanGoals> {
  const parseResult = PlanGoalsSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain Rule: targetDate must be in the future
  if (validated.targetDate && validated.targetDate <= new Date()) {
    return Result.fail(
      new Error(
        `Target date must be in the future (got ${ validated.targetDate.toISOString() })`,
      ),
    );
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates PlanGoals from persistence/fixtures (trusts the data).
 */
export function planGoalsFromPersistence(data: Unbrand<PlanGoals>): Result<PlanGoals> {
  return Result.ok(data as PlanGoals);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating new PlanGoals.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreatePlanGoalsSchema>
 */
export const CreatePlanGoalsSchema: z.ZodType<PlanGoals> = PlanGoalsSchema.unwrap().transform((input, ctx) => {
  const validationResult = validateAndBrand(input);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// 3. SPECIALIZED FACTORIES
// ============================================================================

export function createEventTraining(
  eventName: string,
  distance: number, // meters
  targetDate: Date,
  targetPace: number, // seconds per km or mile
): Result<PlanGoals> {
  return validateAndBrand({
    primary: `${ eventName } Training`,
    secondary: [
      `Run ${ distance / 1000 }km`,
      `Run at pace of ${ Math.floor(targetPace / 60) }:${ targetPace % 60 }/km`,
    ],
    targetMetrics: {
      targetDistance: distance,
      targetPace,
    },
    targetDate,
  });
}

export function createStrengthBuilding(
  primary: string,
  targetWeights: TargetLiftWeight[],
  targetDate?: Date,
): Result<PlanGoals> {
  return validateAndBrand({
    primary,
    secondary: targetWeights.map((w) => `Lift ${ w.weight }kg in ${ w.exercise }`),
    targetMetrics: {
      targetWeights,
    },
    targetDate,
  });
}

export function createHabitBuilding(
  habit: string,
  minStreakDays: number,
  targetDate?: Date,
): Result<PlanGoals> {
  return validateAndBrand({
    primary: `${ habit } Habit Building`,
    secondary: [`Maintain ${ habit } for at least ${ minStreakDays } days in a row`],
    targetMetrics: {
      minStreakDays,
    },
    targetDate,
  });
}


