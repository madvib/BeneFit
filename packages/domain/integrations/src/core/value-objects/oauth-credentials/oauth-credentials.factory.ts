import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { OAuthCredentials, OAuthCredentialsSchema } from './oauth-credentials.types.js';

/**
 * ============================================================================
 * OAUTH CREDENTIALS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. oauthCredentialsFromPersistence() - For fixtures & DB hydration
 * 2. CreateOAuthCredentialsSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates OAuthCredentials with domain-specific business rules */
function validateOAuthCredentials(data: unknown): Result<OAuthCredentials> {
  const parseResult = OAuthCredentialsSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data as OAuthCredentials;

  // Domain Invariant: Expiry must be in the future (for new credentials)
  // We only check this if it's being created/transformed, not if it's from persistence.
  // Actually, validation usually happens in both, but "must be in future" is a creation-time invariant.

  return Result.ok(validated);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates OAuthCredentials from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function oauthCredentialsFromPersistence(
  data: Unbrand<OAuthCredentials>,
): Result<OAuthCredentials> {
  return Result.ok(data as OAuthCredentials);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================


/**
 * Zod transform for creating OAuthCredentials with validation.
 */
export const CreateOAuthCredentialsSchema: z.ZodType<OAuthCredentials> = OAuthCredentialsSchema.extend({
  // Override or add fields for creation if needed
}).transform((input, ctx) => {
  // Domain Invariant: Expiry must be in the future (for new credentials)
  if (input.expiresAt && input.expiresAt <= new Date()) {
    ctx.addIssue({
      code: 'custom',
      message: 'expiresAt must be in the future',
      path: ['expiresAt'],
    });
    return z.NEVER;
  }

  const validationResult = validateOAuthCredentials(input);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateOAuthCredentialsSchema or oauthCredentialsFromPersistence.
 */
export function createOAuthCredentials(props: {
  accessToken: string;
  scopes: string[];
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: 'Bearer' | 'OAuth';
}): Result<OAuthCredentials> {
  const result = CreateOAuthCredentialsSchema.safeParse(props);
  if (!result.success) {
    return Result.fail(mapZodError(result.error));
  }
  return Result.ok(result.data);
}

// ============================================================================
// DOMAIN LOGIC / QUERIES
// ============================================================================

export function isCredentialExpired(credentials: OAuthCredentials): boolean {
  if (!credentials.expiresAt) {
    return false; // No expiry = never expires
  }

  return credentials.expiresAt <= new Date();
}

export function willExpireSoon(
  credentials: OAuthCredentials,
  minutesThreshold: number = 30,
): boolean {
  if (!credentials.expiresAt) {
    return false;
  }

  const threshold = new Date(Date.now() + minutesThreshold * 60 * 1000);
  return credentials.expiresAt <= threshold;
}
