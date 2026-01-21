import { UserStats, Achievement } from './user-stats.types.js';

export function getTotalWorkouts(stats: UserStats): number {
  return stats.totalWorkouts;
}

export function getTotalMinutes(stats: UserStats): number {
  return stats.totalMinutes;
}

export function getTotalVolume(stats: UserStats): number {
  return stats.totalVolume;
}

export function getCurrentStreak(stats: UserStats): number {
  return stats.currentStreak;
}

export function getLongestStreak(stats: UserStats): number {
  return stats.longestStreak;
}

export function getLastWorkoutDate(stats: UserStats): Date | undefined {
  return stats.lastWorkoutDate;
}

export function getAchievements(stats: UserStats): Achievement[] {
  return [...stats.achievements];
}

export function getAchievementsCount(stats: UserStats): number {
  return stats.achievements.length;
}

export function getFirstWorkoutDate(stats: UserStats): Date {
  return stats.firstWorkoutDate;
}

export function getJoinedAt(stats: UserStats): Date {
  return stats.joinedAt;
}

export function hasAchievement(stats: UserStats, achievementId: string): boolean {
  return stats.achievements.some(a => a.id === achievementId);
}

export function hasCompletedWorkouts(stats: UserStats): boolean {
  return stats.totalWorkouts > 0;
}

export function getAverageWorkoutDuration(stats: UserStats): number {
  if (stats.totalWorkouts === 0) return 0;
  return Math.round(stats.totalMinutes / stats.totalWorkouts);
}

export function getAverageVolumePerWorkout(stats: UserStats): number {
  if (stats.totalWorkouts === 0) return 0;
  return Math.round(stats.totalVolume / stats.totalWorkouts);
}

export function getDaysSinceFirstWorkout(stats: UserStats): number {
  const today = new Date();
  const firstWorkoutDay = new Date(stats.firstWorkoutDate);
  firstWorkoutDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - firstWorkoutDay.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if the streak is currently active (workout today or yesterday)
 */
export function isStreakActive(stats: UserStats): boolean {
  if (!stats.lastWorkoutDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(stats.lastWorkoutDate);
  lastWorkout.setHours(0, 0, 0, 0);

  const daysSince = Math.floor(
    (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSince <= 1;
}

/**
 * Get the number of days since the last workout
 */
export function getDaysSinceLastWorkout(stats: UserStats): number | null {
  if (!stats.lastWorkoutDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(stats.lastWorkoutDate);
  lastWorkout.setHours(0, 0, 0, 0);

  return Math.floor(
    (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
  );
}
