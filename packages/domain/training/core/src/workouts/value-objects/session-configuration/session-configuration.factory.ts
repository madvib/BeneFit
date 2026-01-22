import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { SessionConfiguration, SessionConfigurationSchema } from './session-configuration.types.js';

/**
 * ============================================================================
 * SESSION CONFIGURATION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. sessionConfigurationFromPersistence() - For fixtures & DB hydration
 * 2. CreateSessionConfigurationSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates SessionConfiguration with domain-specific business rules */
function validateSessionConfiguration(data: unknown): Result<SessionConfiguration> {
  // Parse with Zod schema
  const parseResult = SessionConfigurationSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  // Return branded entity
  return Result.ok(parseResult.data);
}

/** Creates default configuration based on multiplayer mode */
function getDefaultConfig(isMultiplayer: boolean): Unbrand<SessionConfiguration> {
  return {
    isMultiplayer,
    isPublic: false,
    maxParticipants: isMultiplayer ? 10 : 1,
    allowSpectators: false,
    enableChat: isMultiplayer,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: isMultiplayer,
    autoAdvanceActivities: false,
  };
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates SessionConfiguration from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function sessionConfigurationFromPersistence(
  data: Unbrand<SessionConfiguration>,
): Result<SessionConfiguration> {
  return Result.ok(data as SessionConfiguration);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating SessionConfiguration with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateSessionConfigurationSchema>
 */
export const CreateSessionConfigurationSchema = SessionConfigurationSchema.partial().transform(
  (input, ctx) => {
    // Build entity with defaults
    const defaults = getDefaultConfig(input.isMultiplayer ?? false);
    const data = {
      ...defaults,
      ...input,
    };

    // Validate and brand
    const validationResult = validateSessionConfiguration(data);
    return unwrapOrIssue(validationResult, ctx);
  },
);


