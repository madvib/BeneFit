import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { SessionFeedItem, SessionFeedItemSchema } from './session-feed-item.types.js';

/**
 * ============================================================================
 * SESSION FEED ITEM FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. sessionFeedItemFromPersistence() - For fixtures & DB hydration
 * 2. CreateSessionFeedItemSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates SessionFeedItem with domain-specific business rules */
function validateSessionFeedItem(data: unknown): Result<SessionFeedItem> {
  // Parse with Zod schema
  const parseResult = SessionFeedItemSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  // Return branded entity
  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates SessionFeedItem from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function sessionFeedItemFromPersistence(
  data: Unbrand<SessionFeedItem>,
): Result<SessionFeedItem> {
  return Result.ok(data as SessionFeedItem);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating SessionFeedItem with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateSessionFeedItemSchema>
 */
export const CreateSessionFeedItemSchema = SessionFeedItemSchema.pick({
  type: true,
  userId: true,
  userName: true,
  content: true,
  metadata: true,
}).extend({
  id: z.uuid().optional(),
  timestamp: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  // Build entity with defaults
  const data = {
    ...input,
    id: input.id || randomUUID(),
    timestamp: input.timestamp || new Date(),
  };

  // Validate and brand
  const validationResult = validateSessionFeedItem(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<SessionFeedItem>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateSessionFeedItemSchema or sessionFeedItemFromPersistence.
 * Kept for test compatibility.
 */
export function createFeedItem(
  params: z.input<typeof CreateSessionFeedItemSchema>,
): Result<SessionFeedItem> {
  const data = {
    ...params,
    id: params.id || randomUUID(),
    timestamp: params.timestamp || new Date(),
  };

  return validateSessionFeedItem(data);
}
