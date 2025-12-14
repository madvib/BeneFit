/**
 * Token data structure
 */
export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: 'Bearer' | 'OAuth';
  scope?: string;
}

/**
 * Token management utilities
 */
export class TokenManager {
  /**
   * Check if a token is expired
   */
  static isExpired(expiresAt: number | null | undefined): boolean {
    if (!expiresAt) return false;
    return Date.now() >= expiresAt * 1000;
  }

  /**
   * Check if token needs refresh (with buffer time)
   * @param expiresAt Unix timestamp in seconds
   * @param bufferSeconds Seconds before expiration to consider "needs refresh"
   */
  static needsRefresh(
    expiresAt: number | null | undefined,
    bufferSeconds = 300,
  ): boolean {
    if (!expiresAt) return false;
    return Date.now() >= (expiresAt - bufferSeconds) * 1000;
  }

  /**
   * Calculate expiration timestamp from expires_in value
   * @param expiresIn Seconds until expiration
   * @returns Unix timestamp in seconds
   */
  static calculateExpiresAt(expiresIn: number): number {
    return Math.floor(Date.now() / 1000) + expiresIn;
  }

  /**
   * Serialize token data to JSON string for storage
   */
  static serializeCredentials(tokens: TokenData): string {
    return JSON.stringify({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.expiresAt,
      token_type: tokens.tokenType,
      scope: tokens.scope,
    });
  }

  /**
   * Parse credentials JSON string to TokenData
   */
  static parseCredentials(credentials: string): TokenData {
    try {
      const parsed = JSON.parse(credentials);
      return {
        accessToken: parsed.access_token || parsed.accessToken,
        refreshToken: parsed.refresh_token || parsed.refreshToken,
        expiresAt: parsed.expires_at || parsed.expiresAt,
        tokenType: parsed.token_type || parsed.tokenType,
        scope: parsed.scope,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse credentials: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
