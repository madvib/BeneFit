import { Result } from '@bene/shared-domain';
import type { OAuthCredentials } from '@bene/integrations-domain';

/**
 * Token response from OAuth provider
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // Unix timestamp
  expiresIn?: number; // Seconds until expiration
  tokenType?: string;
  scope?: string;
}

/**
 * Base OAuth 2.0 client with common functionality
 * All integration providers should extend this class
 */
export abstract class OAuth2Client {
  protected accessToken: string | null = null;
  protected refreshToken: string | null = null;
  protected expiresAt: number | null = null;

  constructor(
    protected clientId: string,
    protected clientSecret: string,
    protected tokenUrl: string,
  ) {}

  /**
   * Get the authorization URL for the OAuth flow
   * Must be implemented by each provider
   */
  abstract getAuthorizationUrl(redirectUri: string, state?: string): string;

  /**
   * Exchange authorization code for access token
   */
  async exchangeAuthCode(
    code: string,
    redirectUri: string,
    additionalParams?: Record<string, string>,
  ): Promise<Result<TokenResponse>> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          ...additionalParams,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new Error(`Token exchange failed: ${response.status} ${error}`),
        );
      }

      const data = await response.json();
      const tokenResponse = this.normalizeTokenResponse(data);
      this.setTokens(tokenResponse);

      return Result.ok(tokenResponse);
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to exchange auth code: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<Result<string>> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new Error(`Token refresh failed: ${response.status} ${error}`),
        );
      }

      const data = await response.json();
      const tokenResponse = this.normalizeTokenResponse(data);
      this.setTokens(tokenResponse);

      return Result.ok(tokenResponse.accessToken);
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to refresh token: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Check if the current token is expired
   */
  protected isTokenExpired(): boolean {
    if (!this.expiresAt) return false;
    return Date.now() >= this.expiresAt * 1000;
  }

  /**
   * Check if token needs refresh (with buffer time)
   */
  protected needsRefresh(bufferSeconds = 300): boolean {
    if (!this.expiresAt) return false;
    return Date.now() >= (this.expiresAt - bufferSeconds) * 1000;
  }

  /**
   * Set tokens from response
   */
  protected setTokens(response: TokenResponse): void {
    this.accessToken = response.accessToken;
    if (response.refreshToken) {
      this.refreshToken = response.refreshToken;
    }
    if (response.expiresAt) {
      this.expiresAt = response.expiresAt;
    }
  }

  /**
   * Load tokens from credentials string
   */
  protected loadTokens(credentials: string): void {
    try {
      const parsed = JSON.parse(credentials);
      this.accessToken = parsed.access_token || parsed.accessToken;
      this.refreshToken = parsed.refresh_token || parsed.refreshToken;
      this.expiresAt = parsed.expires_at || parsed.expiresAt;
    } catch (error) {
      console.error('Failed to parse credentials:', error);
    }
  }

  /**
   * Load tokens from ConnectedService OAuthCredentials
   */
  protected loadTokensFromCredentials(credentials: OAuthCredentials): void {
    // Convert OAuthCredentials value object to internal format
    this.accessToken = credentials.accessToken;
    this.refreshToken = credentials.refreshToken || null;
    this.expiresAt = credentials.expiresAt
      ? Math.floor(credentials.expiresAt.getTime() / 1000)
      : null;
  }

  /**
   * Normalize token response from different providers
   * Providers may use different field names (snake_case vs camelCase)
   */
  protected normalizeTokenResponse(data: any): TokenResponse {
    const expiresIn = data.expires_in || data.expiresIn;
    const expiresAt =
      data.expires_at ||
      data.expiresAt ||
      (expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : undefined);

    return {
      accessToken: data.access_token || data.accessToken,
      refreshToken: data.refresh_token || data.refreshToken,
      expiresAt,
      expiresIn,
      tokenType: data.token_type || data.tokenType || 'Bearer',
      scope: data.scope,
    };
  }
}
