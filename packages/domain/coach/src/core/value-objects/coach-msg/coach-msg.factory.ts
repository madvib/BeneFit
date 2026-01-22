import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CoachMsg, CoachMsgSchema } from './coach-msg.types.js';

/**
 * ============================================================================
 * COACH MESSAGE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API:
 * 1. coachMsgFromPersistence() - For fixtures & DB hydration
 * 2. CreateUserMessageSchema - Zod transform for user messages
 * 3. CreateCoachMessageSchema - Zod transform for coach messages
 * 4. CreateSystemMessageSchema - Zod transform for system messages
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands CoachMsg */
function validateCoachMsg(data: unknown): Result<CoachMsg> {
  const parseResult = CoachMsgSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates CoachMsg from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function coachMsgFromPersistence(
  data: Unbrand<CoachMsg>,
): Result<CoachMsg> {
  return Result.ok(data as CoachMsg);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * User Message Creation Schema
 */
export const CreateUserMessageSchema = CoachMsgSchema.pick({
  content: true,
  checkInId: true,
}).extend({
  id: z.uuid().optional(),
  timestamp: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const data = {
    ...input,
    id: input.id || randomUUID(),
    role: 'user' as const,
    timestamp: input.timestamp || new Date(),
  };

  const validationResult = validateCoachMsg(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CoachMsg>;

/**
 * Coach Message Creation Schema
 */
export const CreateCoachMessageSchema = CoachMsgSchema.pick({
  content: true,
  actions: true,
  checkInId: true,
  tokens: true,
}).extend({
  id: z.uuid().optional(),
  timestamp: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const data = {
    ...input,
    id: input.id || randomUUID(),
    role: 'coach' as const,
    timestamp: input.timestamp || new Date(),
  };

  const validationResult = validateCoachMsg(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CoachMsg>;

/**
 * System Message Creation Schema
 */
export const CreateSystemMessageSchema = CoachMsgSchema.pick({
  content: true,
}).extend({
  id: z.uuid().optional(),
  timestamp: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const data = {
    ...input,
    id: input.id || randomUUID(),
    role: 'system' as const,
    timestamp: input.timestamp || new Date(),
  };

  const validationResult = validateCoachMsg(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CoachMsg>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================


