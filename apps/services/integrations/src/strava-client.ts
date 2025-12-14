import { Result } from '@bene/shared-domain';
import type { ConnectedService } from '@bene/integrations-domain';
import { OAuth2Client, HttpClient } from './base/index.js';
import { TokenManager, IntegrationMapper } from './utils/index.js';

/**
 * Strava activity response
 */
export interface StravaActivity {
  id: number;
  resource_state: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: number | null;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng: number[] | null;
  end_latlng: number[] | null;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: {
    id: string;
    polyline: string | null;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string | null;
  from_accepted_tag: boolean;
  upload_id: number | null;
  external_id: string;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  average_temp: number;
  average_watts: number;
  max_watts: number;
  kilojoules: number;
  average_heartrate: number;
  max_heartrate: number;
  elev_high: number;
  elev_low: number;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
}

/**
 * Strava authentication response
 */
interface StravaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;
    sex: string;
    premium: boolean;
    created_at: string;
    updated_at: string;
    badge_type_id: number;
    weight: number;
    profile_medium: string;
    profile: string;
    friend: string | null;
    follower: string | null;
  };
}

/**
 * Strava API client
 * Extends OAuth2Client for authentication and uses HttpClient for API calls
 */
export class StravaClient extends OAuth2Client {
  private http: HttpClient;

  constructor(clientId: string, clientSecret: string) {
    super(clientId, clientSecret, 'https://www.strava.com/oauth/token');
    this.http = new HttpClient('https://www.strava.com/api/v3');
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'read_all,activity:read',
      ...(state && { state }),
    });

    return `https://www.strava.com/oauth/authorize?${ params.toString() }`;
  }

  /**
   * Authenticate with Strava and create ConnectedService
   */
  async authenticate(authCode: string): Promise<Result<ConnectedService>> {
    try {
      // Exchange auth code for tokens
      const tokenResult = await this.exchangeAuthCode(authCode, '');
      if (tokenResult.isFailure) {
        return Result.fail(tokenResult.error);
      }

      const tokens = tokenResult.value;

      // Fetch the full response to get athlete data
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: authCode,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        return Result.fail(new Error('Failed to get athlete data'));
      }

      const data: StravaAuthResponse = (await response.json()) as StravaAuthResponse;

      // Create connected service
      const connectedService = IntegrationMapper.toConnectedService(
        'strava',
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        },
        {
          athleteId: data.athlete.id,
          athleteName: `${ data.athlete.firstname } ${ data.athlete.lastname }`,
          profileUrl: data.athlete.profile,
        },
        {
          read: ['activities', 'profile'],
          write: ['activities'],
        },
      );

      return Result.ok(connectedService);
    } catch (error) {
      return Result.fail(
        new Error(
          `Failed to authenticate with Strava: ${ error instanceof Error ? error.message : String(error) }`,
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
  ): Promise<Result<StravaActivity[]>> {
    if (!this.accessToken || this.needsRefresh()) {
      return Result.fail(
        new Error('Access token expired and no refresh token available'),
      );
    }

    return this.http.get<StravaActivity[]>(
      `/athlete/activities?per_page=${ limit }`,
      this.accessToken,
    );
  }

  /**
   * Sync activities from Strava
   */
  async syncActivities(
    connectedService: ConnectedService,
  ): Promise<Result<StravaActivity[]>> {
    if (connectedService.serviceType !== 'strava') {
      return Result.fail(new Error('Service is not Strava'));
    }

    // Load tokens from connected service
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

      // Update credentials in connected service
      // Cast to mutable to update readonly properties
      const mutableService = connectedService as { credentials: any };
      mutableService.credentials = {
        ...connectedService.credentials,
        accessToken: this.accessToken!,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt ? new Date(this.expiresAt * 1000) : undefined,
      };
    }

    // Get activities since last sync
    const afterDate = connectedService.lastSyncAt
      ? Math.floor(connectedService.lastSyncAt.getTime() / 1000)
      : Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60; // Default to last 30 days

    const result = await this.http.get<StravaActivity[]>(
      `/athlete/activities?after=${ afterDate }&per_page=50`,
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
