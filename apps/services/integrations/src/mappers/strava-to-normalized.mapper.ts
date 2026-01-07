import type { NormalizedActivity } from '@bene/integrations-domain';
import type { StravaActivity } from '../strava-client.js';

/**
 * Maps Strava activity data to our normalized activity structure.
 * This is the contract that other domains (Training) will consume.
 */
export function mapStravaToNormalizedActivity(
  activity: StravaActivity
): NormalizedActivity {
  return {
    externalId: String(activity.id),
    type: activity.sport_type, // e.g., 'Run', 'Ride'
    name: activity.name,
    startDate: activity.start_date,
    duration: activity.moving_time,
    distance: activity.distance,
    isManual: activity.manual,

    // Performance metrics
    averageHeartRate: activity.average_heartrate,
    maxHeartRate: activity.max_heartrate,
    averagePower: activity.average_watts,
    maxPower: activity.max_watts,
    averageCadence: activity.average_cadence,
    averageSpeed: activity.average_speed,
    maxSpeed: activity.max_speed,
    elevationGain: activity.total_elevation_gain,
    calories: activity.kilojoules ? Math.round(activity.kilojoules * 0.239) : undefined,

    // Location
    startLatitude: activity.start_latlng?.[0],
    startLongitude: activity.start_latlng?.[1],

    // Privacy
    isPrivate: activity.private,
  };
}

/**
 * Batch maps multiple Strava activities
 */
export function mapStravaActivitiesToNormalized(
  activities: StravaActivity[]
): NormalizedActivity[] {
  return activities.map(mapStravaToNormalizedActivity);
}
