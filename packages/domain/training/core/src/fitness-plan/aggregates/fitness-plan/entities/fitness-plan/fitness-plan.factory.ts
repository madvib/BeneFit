import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { FitnessPlan, FitnessPlanSchema } from './fitness-plan.types.js';

/**
 * ============================================================================
 * FITNESS PLAN FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (3 exports):
 * 1. fitnessPlanFromPersistence() - For fixtures & DB hydration
 * 2. CreateDraftFitnessPlanSchema - Zod transform for creating drafts
 * 3. ActivateFitnessPlanSchema - Zod transform for activating plans
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates FitnessPlan with domain-specific business rules */
function validateFitnessPlan(data: unknown): Result<FitnessPlan> {
  const parseResult = FitnessPlanSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates FitnessPlan from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function fitnessPlanFromPersistence(
  data: Unbrand<FitnessPlan>,
): Result<FitnessPlan> {
  return Result.ok(data as FitnessPlan);
}

// ============================================================================
// 2. DRAFT CREATION (for API boundaries)
// ============================================================================

export const CreateDraftFitnessPlanSchema = FitnessPlanSchema.pick({
  userId: true,
  title: true,
  description: true,
  planType: true,
  goals: true,
  progression: true,
  constraints: true,
  startDate: true,
  templateId: true,
  weeks: true,
}).transform((input, ctx) => {
  // Build draft entity with defaults
  const now = new Date();
  const data = {
    ...input,
    id: randomUUID(),
    status: 'draft' as const,
    currentPosition: { week: 1, day: 0 },
    createdAt: now,
    updatedAt: now,
    endDate: undefined,
  };

  // Validate and brand
  const validationResult = validateFitnessPlan(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<FitnessPlan>;

// ============================================================================
// 3. ACTIVATION (for state transitions)
// ============================================================================

/**
 * Zod transform for activating a FitnessPlan (draft -> active).
 * Use at API boundaries for plan activation.
 * 
 * Infer input type with: z.input<typeof ActivateFitnessPlanSchema>
 */
export const ActivateFitnessPlanSchema = FitnessPlanSchema.pick({
  userId: true,
  id: true,
  title: true,
  description: true,
  planType: true,
  goals: true,
  progression: true,
  constraints: true,
  startDate: true,
  weeks: true,
  templateId: true,
  currentPosition: true,
  createdAt: true,
  updatedAt: true,
  endDate: true,
}).extend({
  status: z.literal('draft'), // Must be draft to activate
}).transform((input, ctx) => {
  // Domain validation: Must have at least one week
  if (input.weeks.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Cannot activate plan with no weeks',
    });
    return z.NEVER;
  }

  // Domain validation: Start date must be today or future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(input.startDate);
  startDate.setHours(0, 0, 0, 0);

  if (startDate < today) {
    ctx.addIssue({
      code: 'custom',
      message: 'Start date cannot be in the past',
    });
    return z.NEVER;
  }

  // Build active entity
  const data = {
    ...input,
    status: 'active' as const,
    updatedAt: new Date(),
  };

  // Validate and brand
  const validationResult = validateFitnessPlan(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<FitnessPlan>;

