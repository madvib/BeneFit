import { z } from 'zod';

import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { ScheduleValidationError } from '@/fitness-plan/errors/index.js';
import { WeeklySchedule, WeeklyScheduleSchema } from './weekly-schedule.types.js';

/**
 * ============================================================================
 * WEEKLY SCHEDULE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. weeklyScheduleFromPersistence() - For fixtures & DB hydration
 * 2. CreateWeeklyScheduleSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands data with WeeklyScheduleSchema and business rules */
function validateAndBrand(data: unknown): Result<WeeklySchedule> {
  const parseResult = WeeklyScheduleSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Business rule validation (cross-field)
  if (validated.startDate >= validated.endDate) {
    return Result.fail(
      new ScheduleValidationError('Start date must be before end date', {
        startDate: validated.startDate,
        endDate: validated.endDate,
      }),
    );
  }

  if (validated.workouts.length > validated.targetWorkouts) {
    return Result.fail(
      new ScheduleValidationError('Cannot have more workouts than target', {
        workoutsCount: validated.workouts.length,
        targetWorkouts: validated.targetWorkouts,
      }),
    );
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WeeklySchedule from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function weeklyScheduleFromPersistence(
  data: Unbrand<WeeklySchedule>,
): Result<WeeklySchedule> {
  return Result.ok(data as WeeklySchedule);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating a new WeeklySchedule.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateWeeklyScheduleSchema>
 */
export const CreateWeeklyScheduleSchema = WeeklyScheduleSchema.pick({
  planId: true,
  weekNumber: true,
  startDate: true,
  endDate: true,
  focus: true,
  targetWorkouts: true,
  workouts: true,
  notes: true,
}).extend({
  id: z.uuid().optional(),
  workoutsCompleted: z.number().int().min(0).optional(),
}).transform((input, ctx) => {
  // Build the entity with defaults
  const data = {
    ...input,
    id: input.id || crypto.randomUUID(),
    workoutsCompleted: input.workoutsCompleted ?? 0,
  };

  // Validate and brand
  const validationResult = validateAndBrand(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<WeeklySchedule>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateWeeklyScheduleSchema or call via transform.
 */

