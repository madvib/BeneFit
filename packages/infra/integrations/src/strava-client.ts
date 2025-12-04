import { Result } from '@bene/domain';
import type { ConnectedService } from '@bene/domain/integrations';

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

export interface StravaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
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

export class StravaClient {
  private readonly baseUrl = 'https://www.strava.com/api/v3';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  constructor(private clientId: string, private clientSecret: string) {}

  async authenticate(authCode: string): Promise<Result<ConnectedService>> {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
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
        const error = await response.text();
        return Result.fail(`Strava auth failed: ${response.status} ${error}`);
      }

      const data: StravaAuthResponse = await response.json();

      // Store tokens
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresAt = data.expires_at;

      // Create connected service record
      const connectedService: ConnectedService = {
        id: `strava_${data.athlete.id}`,
        userId: '', // This would be set by the calling function
        serviceType: 'strava',
        credentials: JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at,
        }),
        permissions: {
          read: ['activities', 'profile'],
          write: ['activities'],
        },
        syncStatus: {
          lastSync: null,
          status: 'connected',
          error: null,
        },
        metadata: {
          athleteId: data.athlete.id,
          athleteName: `${data.athlete.firstname} ${data.athlete.lastname}`,
          profileUrl: data.athlete.profile,
        },
        isActive: true,
        isPaused: false,
        connectedAt: new Date(),
        lastSyncAt: null,
        updatedAt: new Date(),
      };

      return Result.ok(connectedService);
    } catch (error) {
      return Result.fail(`Failed to authenticate with Strava: ${error}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<Result<string>> {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
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
        return Result.fail(`Token refresh failed: ${response.status} ${error}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.expiresAt = data.expires_at;

      return Result.ok(data.access_token);
    } catch (error) {
      return Result.fail(`Failed to refresh Strava token: ${error}`);
    }
  }

  async getRecentActivities(userId: string, limit = 10): Promise<Result<StravaActivity[]>> {
    // Check if we have a valid access token, refresh if needed
    if (!this.accessToken || (this.expiresAt && Date.now() / 1000 >= this.expiresAt - 300)) {
      // In a real implementation, we would retrieve the refresh token from the database
      return Result.fail('Access token expired and no refresh token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/athlete/activities?per_page=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(`Failed to get activities: ${response.status} ${error}`);
      }

      const activities: StravaActivity[] = await response.json();
      return Result.ok(activities);
    } catch (error) {
      return Result.fail(`Failed to fetch Strava activities: ${error}`);
    }
  }

  async syncActivities(connectedService: ConnectedService): Promise<Result<StravaActivity[]>> {
    if (connectedService.serviceType !== 'strava') {
      return Result.fail('Service is not Strava');
    }

    // Parse credentials
    const credentials = JSON.parse(connectedService.credentials);
    this.accessToken = credentials.access_token;
    this.refreshToken = credentials.refresh_token;
    this.expiresAt = credentials.expires_at;

    // Refresh token if needed
    if (this.expiresAt && Date.now() / 1000 >= this.expiresAt - 300) {
      const refreshResult = await this.refreshAccessToken(this.refreshToken);
      if (refreshResult.isFailure) {
        return refreshResult;
      }
    }

    // Get activities since last sync
    const afterDate = connectedService.lastSyncAt 
      ? Math.floor(connectedService.lastSyncAt.getTime() / 1000) 
      : Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60); // Default to last 30 days

    try {
      const response = await fetch(`${this.baseUrl}/athlete/activities?after=${afterDate}&per_page=50`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(`Sync failed: ${response.status} ${error}`);
      }

      const activities: StravaActivity[] = await response.json();

      // Update last sync timestamp
      connectedService.lastSyncAt = new Date();
      connectedService.updatedAt = new Date();
      connectedService.syncStatus = {
        ...connectedService.syncStatus,
        lastSync: new Date(),
        status: 'success',
        error: null,
      };

      return Result.ok(activities);
    } catch (error) {
      // Update sync status with error
      connectedService.syncStatus = {
        ...connectedService.syncStatus,
        status: 'error',
        error: String(error),
      };
      connectedService.updatedAt = new Date();
      
      return Result.fail(`Failed to sync Strava activities: ${error}`);
    }
  }

  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'read_all,activity:read',
      ...(state && { state }),
    });

    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }
}