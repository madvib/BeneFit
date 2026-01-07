import { Result } from '@bene/shared';
import { HttpClient } from './base/index.js';

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
 * Strava athlete profile
 */
export interface StravaAthlete {
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
}

/**
 * Options for fetching activities
 */
export interface GetActivitiesOptions {
  accessToken: string;
  after?: Date | number; // Unix timestamp or Date
  before?: Date | number;
  page?: number;
  perPage?: number;
}

/**
 * Options for fetching a single activity
 */
export interface GetActivityOptions {
  accessToken: string;
  activityId: number;
  includeAllEfforts?: boolean;
}

/**
 * Strava API client for data operations
 * 
 * OAuth is handled by Better Auth - this client only handles data retrieval
 * All methods require an access token from Better Auth's account table
 */
export class StravaClient {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient('https://www.strava.com/api/v3');
  }

  /**
   * Get authenticated athlete's profile
   */
  async getAthlete(accessToken: string): Promise<Result<StravaAthlete>> {
    return this.http.get<StravaAthlete>('/athlete', accessToken);
  }

  /**
   * Get a list of activities for the authenticated athlete
   */
  async getActivities(
    options: GetActivitiesOptions
  ): Promise<Result<StravaActivity[]>> {
    const params = new URLSearchParams();

    if (options.after) {
      const afterTimestamp = options.after instanceof Date
        ? Math.floor(options.after.getTime() / 1000)
        : options.after;
      params.append('after', String(afterTimestamp));
    }

    if (options.before) {
      const beforeTimestamp = options.before instanceof Date
        ? Math.floor(options.before.getTime() / 1000)
        : options.before;
      params.append('before', String(beforeTimestamp));
    }

    if (options.page) {
      params.append('page', String(options.page));
    }

    if (options.perPage) {
      params.append('per_page', String(options.perPage));
    }

    const url = `/athlete/activities${ params.toString() ? `?${ params.toString() }` : '' }`;
    return this.http.get<StravaActivity[]>(url, options.accessToken);
  }

  /**
   * Get a specific activity by ID
   */
  async getActivity(
    options: GetActivityOptions
  ): Promise<Result<StravaActivity>> {
    const params = new URLSearchParams();

    if (options.includeAllEfforts) {
      params.append('include_all_efforts', 'true');
    }

    const url = `/activities/${ options.activityId }${ params.toString() ? `?${ params.toString() }` : '' }`;
    return this.http.get<StravaActivity>(url, options.accessToken);
  }

  /**
   * Get activities since a specific date (convenience method)
   * Useful for webhook-triggered syncs and background jobs
   */
  async getActivitiesSince(
    accessToken: string,
    since: Date,
    perPage = 30
  ): Promise<Result<StravaActivity[]>> {
    return this.getActivities({
      accessToken,
      after: since,
      perPage,
    });
  }
}
