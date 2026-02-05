import { UserProfile } from "./user-profile.types.js";
import { UserStatsQueries } from "../../value-objects/user-stats/index.js";

/**
 * Check if the user should receive a coaching check-in based on their preferences
 * and workout history.
 */
export function shouldReceiveCheckIn(profile: UserProfile): boolean {
  const frequency = profile.preferences.coaching.checkInFrequency;

  if (frequency === 'never') {
    return false;
  }

  const daysSince = UserStatsQueries.getDaysSinceLastWorkout(profile.stats);

  if (daysSince === null) {
    return true; // No workouts yet, should check in
  }

  switch (frequency) {
    case 'daily':
      return daysSince >= 1;
    case 'weekly':
      return daysSince >= 7;
    case 'biweekly':
      return daysSince >= 14;
    default:
      return false;
  }
}

/**
 * Get the number of days the user has been a member.
 */
export function getMemberSinceDays(profile: UserProfile): number {
  const now = new Date();
  return Math.floor(
    (now.getTime() - profile.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function isStreakActive(profile: UserProfile): boolean {
  return UserStatsQueries.isStreakActive(profile.stats);
}

export function getDaysSinceLastWorkout(profile: UserProfile): number | null {
  return UserStatsQueries.getDaysSinceLastWorkout(profile.stats);
}

export function getAverageWorkoutDuration(profile: UserProfile): number {
  return UserStatsQueries.getAverageWorkoutDuration(profile.stats);
}