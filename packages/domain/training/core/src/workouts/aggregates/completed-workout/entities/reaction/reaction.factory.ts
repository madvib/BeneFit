import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { Reaction, ReactionSchema } from './reaction.types.js';

/**
 * ============================================================================
 * REACTION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. reactionFromPersistence() - For fixtures & DB hydration
 * 2. CreateReactionSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands Reaction */
function validateReaction(data: unknown): Result<Reaction> {
  const parseResult = ReactionSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates Reaction from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function reactionFromPersistence(
  data: Unbrand<Reaction>,
): Result<Reaction> {
  return Result.ok(data as Reaction);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating Reaction with domain validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateReactionSchema>
 */
export const CreateReactionSchema = ReactionSchema.pick({
  userId: true,
  userName: true,
  type: true,
}).extend({
  id: z.uuid().optional(),
  createdAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const data = {
    ...input,
    id: input.id || randomUUID(),
    createdAt: input.createdAt || new Date(),
  };

  const validationResult = validateReaction(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<Reaction>;


