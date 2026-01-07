import { Result } from '@bene/shared';
import type { CompletedWorkout, WorkoutPerformance, WorkoutVerification, WorkoutType } from '@bene/training-core';
import { createCompletedWorkout } from '@bene/training-core';
import type { StravaActivity } from '../strava-client.js';

/**
 * Maps Strava activity types to our WorkoutType domain values
 */
function mapStravaTypeToWorkoutType(
  stravaType: string,
  sportType: string
): WorkoutType {
  // Strava has detailed sport_type, we map to our simpler WorkoutType
  const normalizedType = sportType.toLowerCase();

  if (normalizedType.includes('run')) return 'cardio';
  if (normalizedType.includes('ride') || normalizedType.includes('cycling')) return 'cardio';
  if (normalizedType.includes('swim')) return 'cardio';
  if (normalizedType.includes('hike') || normalizedType.includes('walk')) return 'cardio';
  if (normalizedType.includes('yoga')) return 'flexibility';
  if (normalizedType.includes('strength') || normalizedType.includes('weight')) return 'strength';
  if (normalizedType.includes('crossfit') || normalizedType.includes('workout')) return 'strength';

  // Default to cardio for unknown types
  return 'cardio';
}

/**
 * Calculates perceived exertion estimate from Strava data
 * Uses average heart rate as proxy if available
 */
function calculatePerceivedExertion(activity: StravaActivity): number {
  // If we have heart rate data, use it as a proxy for RPE
  if (activity.average_heartrate) {
    // Rough mapping: 120-180 bpm → 5-9 RPE
    // This is a simplification - real RPE should come from athlete
    const normalized = Math.min(Math.max(activity.average_heartrate, 120), 180);
    return Math.round(((normalized - 120) / 60) * 4 + 5);
  }

  // Fallback: Use average speed/pace relative to max as proxy
  if (activity.average_speed && activity.max_speed) {
    const intensity = activity.average_speed / activity.max_speed;
    return Math.round(intensity * 4 + 5); // 5-9 RPE range
  }

  // Default moderate effort
  return 6;
}

/**
 * Maps a Strava activity to a CompletedWorkout
 */
export function mapStravaActivityToCompletedWorkout(
  activity: StravaActivity,
  userId: string
): Result<CompletedWorkout> {
  const workoutType = mapStravaTypeToWorkoutType(activity.type, activity.sport_type);

  // Map performance data
  const performance: WorkoutPerformance = {
    completedAt: new Date(activity.start_date),
    durationMinutes: Math.round(activity.moving_time / 60), // Convert seconds to minutes
    perceivedExertion: calculatePerceivedExertion(activity),
    enjoyment: 7, // Default mid-high enjoyment - could be enhanced with kudos count
    difficultyRating: 'moderate', // Default - no direct mapping from Strava
    notes: activity.name, // Use activity title as notes

    // Cardio-specific metrics
    activities: [{
      id: String(activity.id),
      activityType: activity.sport_type,
      distance: activity.distance, // meters
      averageHeartRate: activity.average_heartrate,
      maxHeartRate: activity.max_heartrate,
      elevationGain: activity.total_elevation_gain,
      averagePower: activity.average_watts,
      maxPower: activity.max_watts,
      averageCadence: activity.average_cadence,
      averageSpeed: activity.average_speed,
      maxSpeed: activity.max_speed,
      calories: activity.kilojoules ? Math.round(activity.kilojoules * 0.239) : undefined, // kJ to kcal
      // Note: exercises array would be used for strength training with sets/reps
      exercises: undefined,
    }],
  };

  // Verification - Strava activities are GPS-verified
  const verification: WorkoutVerification = {
    verified: !activity.manual, // GPS activities are verified, manual uploads are not
    verificationMethod: activity.manual ? 'self_reported' : 'gps',
    gpsData: activity.start_latlng
      ? {
        startLatitude: activity.start_latlng[0],
        startLongitude: activity.start_latlng[1],
      }
      : undefined,
    externalId: String(activity.id), // Store Strava activity ID for reference
  };

  // Create the completed workout
  return createCompletedWorkout({
    userId,
    workoutType,
    description: `${ activity.name } - Synced from Strava`,
    performance,
    verification,
    isPublic: !activity.private, // Respect Strava's privacy settings
  });
}

/**
 * Batch maps multiple Strava activities to CompletedWorkouts
 * Filters out failed conversions and returns successful ones
 */
export function mapStravaActivitiesToCompletedWorkouts(
  activities: StravaActivity[],
  userId: string
): { successes: CompletedWorkout[]; failures: Array<{ activity: StravaActivity; error: Error }> } {
  const successes: CompletedWorkout[] = [];
  const failures: Array<{ activity: StravaActivity; error: Error }> = [];

  for (const activity of activities) {
    const result = mapStravaActivityToCompletedWorkout(activity, userId);

    if (result.isSuccess) {
      successes.push(result.value);
    } else {
      failures.push({
        activity,
        error: result.error instanceof Error ? result.error : new Error(String(result.error)),
      });
    }
  }

  return { successes, failures };
}
