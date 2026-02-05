import { z } from 'zod';
import type { DomainBrandTag } from '@bene/shared';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const OAuthTokenTypeSchema = z.enum(['Bearer', 'OAuth']);

export const OAuthCredentialsSchema = z
  .object({
    accessToken: z.string().min(1), // Should be encrypted at rest
    refreshToken: z.string().min(1).optional(), // Should be encrypted at rest
    expiresAt: z.coerce.date<Date>().optional(),
    scopes: z.array(z.string()).min(1),
    tokenType: OAuthTokenTypeSchema.default('Bearer'),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type OAuthTokenType = z.infer<typeof OAuthTokenTypeSchema>;
export type OAuthCredentials = Readonly<z.infer<typeof OAuthCredentialsSchema>>;

