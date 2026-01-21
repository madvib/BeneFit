import { CreateView, serializeForView } from '@bene/shared';
import { OAuthCredentials } from './oauth-credentials.types.js';
import { isCredentialExpired, willExpireSoon } from './oauth-credentials.factory.js';


/**
 * 3. VIEW TYPES (Serialized with sensitive tokens OMITTED for security)
 */
export type OAuthCredentialsView = CreateView<
  OAuthCredentials,
  'accessToken' | 'refreshToken',
  {
    isValid: boolean;
    hasRefreshToken: boolean;
    isExpired: boolean;
    willExpireSoon: boolean;
  }
>;

/**
 * Map OAuthCredentials value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - OMITS sensitive tokens (accessToken, refreshToken) for security
 * - Adds computed security status fields
 */
export function toOAuthCredentialsView(credentials: OAuthCredentials): OAuthCredentialsView {
  const base = serializeForView(credentials);

  return {
    ...base,
    isValid: !isCredentialExpired(credentials),
    hasRefreshToken: !!credentials.refreshToken,
    isExpired: isCredentialExpired(credentials),
    willExpireSoon: willExpireSoon(credentials, 30),
  };
}
