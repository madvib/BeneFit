import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  WorkoutTemplate,
  WorkoutTemplateSchema,
  WorkoutStatusSchema,
  WORKOUT_TEMPLATE_ERRORS,
} from './workout-template.types.js';
import { WorkoutTemplateValidationError } from '@/fitness-plan/errors/index.js';

/**
 * ============================================================================
 * WORKOUT TEMPLATE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. workoutTemplateFromPersistence() - For fixtures & DB hydration
 * 2. CreateWorkoutTemplateSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands data with WorkoutTemplateSchema and business rules */
function validateAndBrand(data: unknown): Result<WorkoutTemplate> {
  const parseResult = WorkoutTemplateSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Business rule validation (cross-field)
  if (validated.type !== 'rest' && validated.activities.length === 0) {
    return Result.fail(
      new WorkoutTemplateValidationError(
        WORKOUT_TEMPLATE_ERRORS.MISSING_ACTIVITIES,
        { type: validated.type },
      ),
    );
  }

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WorkoutTemplate from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function workoutTemplateFromPersistence(
  data: Unbrand<WorkoutTemplate>,
): Result<WorkoutTemplate> {
  return Result.ok(data as WorkoutTemplate);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating a new WorkoutTemplate.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateWorkoutTemplateSchema>
 */
export const CreateWorkoutTemplateSchema = WorkoutTemplateSchema.pick({
  planId: true,
  weekNumber: true,
  dayOfWeek: true,
  scheduledDate: true,
  title: true,
  description: true,
  type: true,
  category: true,
  goals: true,
  activities: true,
  importance: true,
  alternatives: true,
}).extend({
  id: z.uuid().optional(),
  status: WorkoutStatusSchema.optional(),
  rescheduledTo: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  // Build the entity with defaults
  const data = {
    ...input,
    id: input.id || randomUUID(),
    status: input.status ?? 'scheduled',
    rescheduledTo: input.rescheduledTo,
    completedWorkoutId: undefined,
    userNotes: undefined,
    coachNotes: undefined,
  };

  // Validate and brand
  const validationResult = validateAndBrand(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<WorkoutTemplate>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateWorkoutTemplateSchema or call via transform.
 */
export function createWorkoutTemplate(
  params: z.infer<typeof CreateWorkoutTemplateSchema>,
): Result<WorkoutTemplate> {
  const data = {
    ...params,
    id: params.id || randomUUID(),
    status: params.status ?? 'scheduled',
    rescheduledTo: params.rescheduledTo,
    completedWorkoutId: undefined,
    userNotes: undefined,
    coachNotes: undefined,
  };

  return validateAndBrand(data);
}
