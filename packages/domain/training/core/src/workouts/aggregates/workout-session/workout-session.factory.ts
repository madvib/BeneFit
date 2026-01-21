import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  createDefaultSessionConfig,
  SessionConfigurationSchema
} from '../../value-objects/index.js';
import { WorkoutSession, WorkoutSessionSchema } from './workout-session.types.js';

/**
 * ============================================================================
 * WORKOUT SESSION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. workoutSessionFromPersistence() - For fixtures & DB hydration
 * 2. CreateWorkoutSessionSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands WorkoutSession */
function validateWorkoutSession(data: unknown): Result<WorkoutSession> {
  const parseResult = WorkoutSessionSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WorkoutSession from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function workoutSessionFromPersistence(
  data: Unbrand<WorkoutSession>,
): Result<WorkoutSession> {
  return Result.ok(data as WorkoutSession);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating WorkoutSession with domain validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateWorkoutSessionSchema>
 */
export const CreateWorkoutSessionSchema: z.ZodType<WorkoutSession> = WorkoutSessionSchema.pick({
  ownerId: true,
  workoutType: true,
  activities: true,
  planId: true,
  workoutTemplateId: true,
}).extend({
  id: z.uuid().optional(),
  isMultiplayer: z.boolean().optional(),
  configuration: SessionConfigurationSchema.partial().optional(),
  createdAt: z.coerce.date<Date>().optional(),
  updatedAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const isMultiplayer = input.isMultiplayer ?? false;
  const config = {
    ...createDefaultSessionConfig(isMultiplayer),
    ...input.configuration,
  };
  const now = new Date();

  // Initial state logic
  const data = {
    ...input,
    id: input.id || randomUUID(),
    state: 'preparing',
    currentActivityIndex: 0,
    completedActivities: [],
    configuration: config,
    participants: [],
    activityFeed: [],
    totalPausedSeconds: 0,
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
  };

  // Validate and brand
  const validationResult = validateWorkoutSession(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateWorkoutSessionSchema or call via transform.
 */
export function createWorkoutSession(
  params: z.input<typeof CreateWorkoutSessionSchema>,
): Result<WorkoutSession> {
  const parseResult = CreateWorkoutSessionSchema.safeParse(params);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }
  return Result.ok(parseResult.data as WorkoutSession);
}
