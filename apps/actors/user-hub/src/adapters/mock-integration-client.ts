import { Result } from '@bene/shared-domain';
import { OAuthCredentials, ServicePermissions } from '@bene/integrations-domain';
import { IntegrationClient } from '@bene/integrations-domain'; // Assuming it's exported from there

export class MockIntegrationClient implements IntegrationClient {
  public supportsWebhooks = false;

  async exchangeAuthCode(
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
  > {
    // Return mock token
    return Result.ok({
      accessToken: `mock-access-token-${ code }`,
      refreshToken: `mock-refresh-token-${ code }`,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      scopes: ['read', 'activity:read'],
      permissions: {
        canReadProfile: true,
        canReadWorkouts: true,
        canWriteWorkouts: false,
      },
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<Result<OAuthCredentials>> {
    return Result.ok({
      accessToken: `mock-new-access-token`,
      refreshToken: `mock-new-refresh-token`,
      expiresAt: new Date(Date.now() + 3600 * 1000),
      scopes: ['read', 'activity:read'],
      tokenType: 'Bearer',
    });
  }

  async getUserProfile(accessToken: string): Promise<
    Result<{
      id: string;
      username: string;
      profileUrl?: string;
      units?: 'metric' | 'imperial';
    }>
  > {
    return Result.ok({
      id: 'mock-external-id',
      username: 'mock-user',
      units: 'metric',
    });
  }

  async getActivitiesSince(accessToken: string, since: Date): Promise<Result<Array<unknown>>> {
    return Result.ok([]);
  }
}
