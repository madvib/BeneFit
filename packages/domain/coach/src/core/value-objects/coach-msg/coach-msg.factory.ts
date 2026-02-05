import { z } from 'zod';

import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { CoachMsg, CoachMsgSchema, MessageRole } from './coach-msg.types.js';

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
/**
 * Internal helper to create role-specific message schemas
 */
function createMessageSchema<TRole extends MessageRole>(
  role: TRole,
  pickFields: (keyof z.infer<typeof CoachMsgSchema>)[],
) {
  return CoachMsgSchema.pick(

    Object.fromEntries(pickFields.map(k => [k, true])) as any


  ).extend({
    id: z.uuid().optional(),
    timestamp: z.coerce.date<Date>().optional(),
  }).transform((input, ctx) => {
    const data = {
      ...input,
      id: input.id || crypto.randomUUID(),
      role,
      timestamp: input.timestamp || new Date(),
    };
    const validationResult = validateCoachMsg(data);
    return unwrapOrIssue(validationResult, ctx);
  }) satisfies z.ZodType<CoachMsg>;
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
export const CreateUserMessageSchema = createMessageSchema('user', [
  'content',
  'checkInId',
]);

/**
 * Coach Message Creation Schema
 */
export const CreateCoachMessageSchema = createMessageSchema('coach', [
  'content',
  'actions',
  'checkInId',
  'tokens',
]);

/**
 * System Message Creation Schema
 */
export const CreateSystemMessageSchema = createMessageSchema('system', [
  'content',
]);