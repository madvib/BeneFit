import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  SessionParticipant,
  SessionParticipantSchema,
} from './session-participant.types.js';

/**
 * ============================================================================
 * SESSION PARTICIPANT FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. sessionParticipantFromPersistence() - For fixtures & DB hydration
 * 2. CreateSessionParticipantSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates SessionParticipant with domain-specific business rules */
function validateSessionParticipant(data: unknown): Result<SessionParticipant> {
  // Parse with Zod schema
  const parseResult = SessionParticipantSchema.safeParse(data);

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
 * Rehydrates SessionParticipant from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 * 
 * Used when loading from database or creating test fixtures.
 * Assumes data is structurally valid (was validated before save).
 */
export function sessionParticipantFromPersistence(
  data: Unbrand<SessionParticipant>,
): Result<SessionParticipant> {
  return Result.ok(data as SessionParticipant);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating SessionParticipant with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Domain Invariants:
 * - userId and userName are required and non-empty (validated via schema)
 * - Status always starts as 'active'
 * - JoinedAt is auto-set to current time
 * - CompletedActivities starts at 0
 * 
 * Infer input type with: z.input<typeof CreateSessionParticipantSchema>
 */
export const CreateSessionParticipantSchema = SessionParticipantSchema.pick({
  userId: true,
  userName: true,
  avatar: true,
  role: true,
}).transform((input, ctx) => {
  // Build entity with defaults
  const data = {
    userId: input.userId,
    userName: input.userName,
    avatar: input.avatar,
    role: input.role,
    status: 'active' as const,
    joinedAt: new Date(),
    completedActivities: 0,
    leftAt: undefined,
    currentActivity: undefined,
  };

  // Validate and brand
  const validationResult = validateSessionParticipant(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<SessionParticipant>;

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateSessionParticipantSchema or sessionParticipantFromPersistence.
 * Kept for test compatibility.
 */

