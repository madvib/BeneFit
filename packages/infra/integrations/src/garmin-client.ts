import { Result } from '@bene/domain';
import type { ConnectedService } from '@bene/domain/integrations';

// Garmin Connect API responses and types
export interface GarminActivity {
  activityId: number;
  activityType: {
    typeId: number;
    typeKey: string; // e.g., "running", "cycling", "swimming"
    type: string; // e.g., "Running", "Cycling", "Swimming"
  };
  activityName: string;
  description: string;
  startTimeLocal: string; // ISO format
  endTimeLocal: string;
  duration: number; // in seconds
  distance: number; // in meters
  averageHeartRate: number;
  maxHeartRate: number;
  averageSpeed: number; // in m/s
  maxSpeed: number; // in m/s
  steps: number;
  calories: number;
  elevationGain: number; // in meters
  elevationLoss: number; // in meters
  floorsClimbed: number;
  floorsDescended: number;
  intensity: number;
  averageTrainingEffect: number;
  vo2MaxValue: number;
  maxElevation: number;
  minElevation: number;
  avgVerticalOscillation: number;
  avgGroundContactTime: number;
  avgStrideLength: number;
  avgFractionalPauses: number;
  trainingStressScore: number;
  intensityFactor: number;
  sourceType: string;
  activityLikeCount: number;
  activityCommentCount: number;
  ownerDisplayName: string;
  ownerFullName: string;
  ownerProfileImageLarge: string;
  ownerProfileImageSmall: string;
  activityStatus: string; // "public", "private", etc.
  privacy: {
    typeId: number;
    typeKey: string;
  };
  userRoles: string[];
  hasVideo: boolean;
  hasTimer: boolean;
  hasStartTimestamp: boolean;
  hasLapCount: boolean;
  hasPoolSwimDetails: boolean;
  hasAutoLaps: boolean;
  hasSplitSummaries: boolean;
  hasHrDetails: boolean;
  hasPowerDetails: boolean;
  hasCadenceDetails: boolean;
  hasTemperatureDetails: boolean;
  hasEventSummaries: boolean;
  hasRespirationDetails: boolean;
  hasHrvDetails: boolean;
  hasJumpDetails: boolean;
  hasStressDetails: boolean;
  hasRecoveryTimeDetails: boolean;
  hasRecoveryHeartRateDetails: boolean;
  hasLactateDetails: boolean;
  hasTrainingEffectDetails: boolean;
  hasDeadliftingDetails: boolean;
  hasClimbingDetails: boolean;
  hasWellnessData: boolean;
  hasManualCaloriesDetails: boolean;
  hasManualGoals: boolean;
  isParent: boolean;
  hasChildren: boolean;
  parentId: number;
  isHidden: boolean;
  isTrashed: boolean;
  isAutoActivityUpload: boolean;
  hasPolyline: boolean;
  hasImages: boolean;
  hasActivityGoals: boolean;
  hasHillScoreDetails: boolean;
  hasWeather: boolean;
  hasSplits: boolean;
  hasCourse: boolean;
  hasWorkout: boolean;
  hasHrvAnalysis: boolean;
  hasHydration: boolean;
  hasRaceAnalysis: boolean;
  hasPowerZones: boolean;
  hasHeartRateZones: boolean;
  hasStrokeType: boolean;
  hasPoolLength: boolean;
  hasIncidentDetection: boolean;
  hasVideoAnalysis: boolean;
  hasDailyFeedback: boolean;
  hasAdaptiveTraining: boolean;
  hasTrainingStatusDetermination: boolean;
  hasTrainingLoadBalance: boolean;
  hasPaceDetails: boolean;
  hasWorkoutPlanDetails: boolean;
  hasWorkoutCustomization: boolean;
  hasRunningDynamics: boolean;
  hasRunningStatus: boolean;
  hasRunningRacePredictions: boolean;
  hasRunningTrainingStatus: boolean;
  hasRunningWorkouts: boolean;
  hasRunningGoals: boolean;
  hasRunningInsights: boolean;
  hasRunningMetrics: boolean;
  hasRunningTrainingLoad: boolean;
  hasRunningPower: boolean;
  hasRunningHeartRate: boolean;
  hasRunningCadence: boolean;
  hasRunningTemperature: boolean;
  hasRunningElevation: boolean;
  hasRunningForm: boolean;
  hasRunningRecovery: boolean;
  hasRunningStrength: boolean;
  hasRunningFlexibility: boolean;
  hasRunningBalance: boolean;
  hasRunningPlyometrics: boolean;
  hasRunningCardio: boolean;
  hasRunningCore: boolean;
  hasRunningEndurance: boolean;
  hasRunningSpeed: boolean;
  hasRunningAgility: boolean;
  hasRunningPowerZones: boolean;
  hasRunningHeartRateZones: boolean;
}

export interface GarminAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds until expiration
  token_type: string;
  scope: string;
}

export class GarminClient {
  private readonly baseUrl = 'https://connectapi.garmin.com';
  private readonly oauthUrl = 'https://sso.garmin.com/sso';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  constructor(
    private clientId: string, 
    private clientSecret: string,
    private redirectUri: string
  ) {}

  // Note: Garmin OAuth is complex and involves multiple steps including
  // SAML assertion and requires special handling for the authentication flow
  // This is a simplified implementation focusing on API access
  async authenticate(authCode: string): Promise<Result<ConnectedService>> {
    try {
      // Exchange authorization code for access token
      const response = await fetch(`${this.oauthUrl}/oauth2/token`, {
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
        return Result.fail(`Garmin auth failed: ${response.status} ${error}`);
      }

      const data: GarminAuthResponse = await response.json();

      // Store tokens
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresAt = Date.now() + (data.expires_in * 1000);

      // Create connected service record
      const connectedService: ConnectedService = {
        id: `garmin_${Date.now()}`, // Garmin doesn't provide a stable ID like Strava
        userId: '', // This would be set by the calling function
        serviceType: 'garmin',
        credentials: JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: this.expiresAt,
        }),
        permissions: {
          read: ['activities', 'profile', 'body_composition', 'sleep', 'stress', 'respiration'],
          write: [], // Garmin's API doesn't support writing activities in the same way
        },
        syncStatus: {
          lastSync: null,
          status: 'connected',
          error: null,
        },
        metadata: {
          // Garmin doesn't provide a simple user ID in the auth response
          // This would typically be obtained through a separate profile request
        },
        isActive: true,
        isPaused: false,
        connectedAt: new Date(),
        lastSyncAt: null,
        updatedAt: new Date(),
      };

      return Result.ok(connectedService);
    } catch (error) {
      return Result.fail(`Failed to authenticate with Garmin: ${error}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<Result<string>> {
    try {
      const response = await fetch(`${this.oauthUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(`Token refresh failed: ${response.status} ${error}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.expiresAt = Date.now() + (data.expires_in * 1000);

      return Result.ok(data.access_token);
    } catch (error) {
      return Result.fail(`Failed to refresh Garmin token: ${error}`);
    }
  }

  async getRecentActivities(userId: string, limit = 10): Promise<Result<GarminActivity[]>> {
    // Check if we have a valid access token, refresh if needed
    if (!this.accessToken || (this.expiresAt && Date.now() >= this.expiresAt - 300000)) { // 5 min before expiration
      return Result.fail('Access token expired and no refresh token available');
    }

    try {
      // Garmin's API uses different endpoints than Strava
      // This is a simplified approach - actual implementation would need to handle
      // multiple API endpoints for different activity types
      const response = await fetch(
        `${this.baseUrl}/activity-service/activitylist-service/activities/search/active-session?start=0&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(`Failed to get activities: ${response.status} ${error}`);
      }

      const activities: GarminActivity[] = await response.json();
      return Result.ok(activities);
    } catch (error) {
      return Result.fail(`Failed to fetch Garmin activities: ${error}`);
    }
  }

  async syncActivities(connectedService: ConnectedService): Promise<Result<GarminActivity[]>> {
    if (connectedService.serviceType !== 'garmin') {
      return Result.fail('Service is not Garmin');
    }

    // Parse credentials
    const credentials = JSON.parse(connectedService.credentials);
    this.accessToken = credentials.access_token;
    this.refreshToken = credentials.refresh_token;
    this.expiresAt = credentials.expires_at;

    // Refresh token if needed
    if (this.expiresAt && Date.now() >= this.expiresAt - 300000) { // 5 min before expiration
      const refreshResult = await this.refreshAccessToken(this.refreshToken);
      if (refreshResult.isFailure) {
        return refreshResult;
      }
    }

    // Get activities since last sync
    const afterDate = connectedService.lastSyncAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days

    try {
      // Garmin API has different endpoints for different data types
      // This simplified approach gets recent activities
      const response = await fetch(
        `${this.baseUrl}/activity-service/activitylist-service/activities/search/active-session?start=0&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(`Sync failed: ${response.status} ${error}`);
      }

      const activities: GarminActivity[] = await response.json();

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
      
      return Result.fail(`Failed to sync Garmin activities: ${error}`);
    }
  }

  getAuthorizationUrl(state?: string): string {
    // Garmin's OAuth flow is complex and requires special handling
    // This is a simplified version - actual implementation would require
    // additional steps including SAML handling
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'activity_read',
      ...(state && { state }),
    });

    return `${this.oauthUrl}/oauth2/embed?${params.toString()}`;
  }
}