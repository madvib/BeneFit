import { Result } from '@bene/shared-domain';
import { OAuthCredentials, ServicePermissions } from '@core/index.js';

export interface IntegrationClient {
  supportsWebhooks: boolean;

  exchangeAuthCode(
    code: string,
    redirectUri: string,
  ): Promise<
    Result<{
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
      scopes: string[];
      permissions: ServicePermissions;
    }>
  >;

  refreshAccessToken(refreshToken: string): Promise<Result<OAuthCredentials>>;

  getUserProfile(accessToken: string): Promise<
    Result<{
      id: string;
      username: string;
      profileUrl?: string;
      units?: 'metric' | 'imperial';
    }>
  >;

  getActivitiesSince(accessToken: string, since: Date): Promise<Result<Array<unknown>>>;
}
