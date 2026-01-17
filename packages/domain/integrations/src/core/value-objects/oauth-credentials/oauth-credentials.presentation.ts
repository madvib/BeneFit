import { z } from 'zod';
import { OAuthCredentials } from './oauth-credentials.js';
import { isCredentialExpired } from './oauth-credentials.js';

export const TokenTypeSchema = z.enum(['Bearer', 'OAuth']);

export const OAuthCredentialsPresentationSchema = z.object({
  // Note: accessToken and refreshToken are REDACTED (sensitive data)
  expiresAt: z.iso.datetime().optional(),
  scopes: z.array(z.string().min(1).max(100)),
  tokenType: TokenTypeSchema,
  // Computed fields
  isExpired: z.boolean(),
  expiresInMinutes: z.number().int().min(0).max(1000000).optional(),
});

export type OAuthCredentialsPresentation = z.infer<typeof OAuthCredentialsPresentationSchema>;

export function toOAuthCredentialsPresentation(
  credentials: OAuthCredentials
): OAuthCredentialsPresentation {
  const isExpired = isCredentialExpired(credentials);
  const expiresInMinutes = credentials.expiresAt
    ? Math.floor((credentials.expiresAt.getTime() - Date.now()) / (1000 * 60))
    : undefined;

  return {
    // accessToken and refreshToken are intentionally omitted (sensitive)
    expiresAt: credentials.expiresAt?.toISOString(),
    scopes: [...credentials.scopes],
    tokenType: credentials.tokenType,
    // Computed
    isExpired,
    expiresInMinutes: expiresInMinutes !== undefined && expiresInMinutes > 0 ? expiresInMinutes : undefined,
  };
}
