import { Result } from '@bene/shared-domain';
import type { ConnectedService } from '@bene/integrations-domain';
import { OAuth2Client, HttpClient } from './base/index.js';
import { TokenManager, IntegrationMapper } from '../utils/index.js';
import type { OAuthCredentials } from '@bene/integrations-domain';

/**
 * Garmin activity response (simplified - actual response is much larger)
 */
export interface GarminActivity {
  activityId: number;
  activityType: {
    typeId: number;
    typeKey: string;
    type: string;
  };
  activityName: string;
  description: string;
  startTimeLocal: string;
  endTimeLocal: string;
  duration: number;
  distance: number;
  averageHeartRate: number;
  maxHeartRate: number;
  averageSpeed: number;
  maxSpeed: number;
  steps: number;
  calories: number;
  elevationGain: number;
  elevationLoss: number;
  floorsClimbed: number;
  floorsDescended: number;
  intensity: number;
  averageTrainingEffect: number;
  vo2MaxValue: number;
  maxElevation: number;
  minElevation: number;
}

/**
 * Garmin authentication response
 */
interface GarminAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Garmin Connect API client
 * Extends OAuth2Client for authentication and uses HttpClient for API calls
 */
export class GarminClient extends OAuth2Client {
  private http: HttpClient;
  private readonly redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    super(clientId, clientSecret, 'https://sso.garmin.com/sso/oauth2/token');
    this.http = new HttpClient('https://connectapi.garmin.com');
    this.redirectUri = redirectUri;
  }

  /**
   * Get authorization URL for OAuth flow
   * Note: Garmin's OAuth flow is complex and involves SAML
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: 'activity_read',
      ...(state && { state }),
    });

    return `https://sso.garmin.com/sso/oauth2/embed?${params.toString()}`;
  }

  /**
   * Authenticate with Garmin and create ConnectedService
   */
  async authenticate(authCode: string): Promise<Result<ConnectedService>> {
    try {
      // Exchange authorization code for access token
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: authCode,
          redirect_uri: this.redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new Error(`Garmin auth failed: ${response.status} ${error}`),
        );
      }

      const data: GarminAuthResponse = (await response.json()) as GarminAuthResponse;

      // Store tokens
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresAt = TokenManager.calculateExpiresAt(data.expires_in);

      // Create connected service
      const connectedService = IntegrationMapper.toConnectedService(
        'garmin',
        {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: this.expiresAt,
          tokenType: data.token_type as 'Bearer' | 'OAuth',
          scope: data.scope,
        },
        {
          // Garmin doesn't provide user ID in auth response
          // Would need separate profile API call
          externalUserId: undefined, // Set after getting user profile
          externalUsername: undefined, // Set after getting user profile
          profileUrl: undefined, // Set after getting user profile
          athleteType: undefined, // Set after getting user profile
          units: 'metric', // Default, can be updated after getting profile
          supportsWebhooks: false, // Check Garmin's API documentation
          webhookRegistered: false,
          webhookUrl: undefined,
        },
        {
          read: [
            'activities',
            'profile',
            'body_composition',
            'sleep',
            'stress',
            'respiration',
          ],
          write: [],
        },
      );

      return Result.ok(connectedService);
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to authenticate with Garmin: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Get recent activities for a user
   */
  async getRecentActivities(
    userId: string,
    limit = 10,
  ): Promise<Result<GarminActivity[]>> {
    if (!this.accessToken || this.needsRefresh()) {
      return Result.fail(
        new Error('Access token expired and no refresh token available'),
      );
    }

    return this.http.get<GarminActivity[]>(
      `/activity-service/activitylist-service/activities/search/active-session?start=0&limit=${limit}`,
      this.accessToken,
    );
  }

  /**
   * Sync activities from Garmin
   */
  async syncActivities(
    connectedService: ConnectedService,
  ): Promise<Result<GarminActivity[]>> {
    if (connectedService.serviceType !== 'garmin') {
      return Result.fail(new Error('Service is not Garmin'));
    }

    // Load tokens from connected service OAuthCredentials value object
    this.loadTokensFromCredentials(connectedService.credentials);

    // Refresh token if needed
    if (this.needsRefresh() && this.refreshToken) {
      const refreshResult = await this.refreshAccessToken(this.refreshToken);
      if (refreshResult.isFailure) {
        IntegrationMapper.markSyncError(
          connectedService,
          refreshResult.error instanceof Error
            ? refreshResult.error.message
            : String(refreshResult.error),
        );
        return Result.fail(refreshResult.error);
      }
    }

    // Get recent activities
    const result = await this.http.get<GarminActivity[]>(
      `/activity-service/activitylist-service/activities/search/active-session?start=0&limit=50`,
      this.accessToken!,
    );

    if (result.isSuccess) {
      IntegrationMapper.markSyncSuccess(connectedService);
    } else {
      IntegrationMapper.markSyncError(
        connectedService,
        result.error instanceof Error ? result.error.message : String(result.error),
      );
    }

    return result;
  }
}
