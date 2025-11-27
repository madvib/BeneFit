import { UserStats, Achievement } from './user-stats.types.js';

// Update functions
export function addWorkout(stats: UserStats, durationMinutes: number, volumeLifted: number = 0): UserStats {
  const newTotalWorkouts = stats.totalWorkouts + 1;
  const newTotalMinutes = stats.totalMinutes + durationMinutes;
  const newTotalVolume = stats.totalVolume + volumeLifted;

  return {
    ...stats,
    totalWorkouts: newTotalWorkouts,
    totalMinutes: newTotalMinutes,
    totalVolume: newTotalVolume,
    lastWorkoutDate: new Date(),
  };
}

export function addStreak(stats: UserStats, days: number): UserStats {
  const newStreak = stats.currentStreak + days;
  const longestStreak = Math.max(newStreak, stats.longestStreak);

  return {
    ...stats,
    currentStreak: newStreak,
    longestStreak: longestStreak,
  };
}

export function resetCurrentStreak(stats: UserStats): UserStats {
  return {
    ...stats,
    currentStreak: 0,
  };
}

export function addAchievement(stats: UserStats, achievement: Achievement): UserStats {
  // Check if achievement already exists
  const alreadyExists = stats.achievements.some(a => a.id === achievement.id);
  if (alreadyExists) {
    return stats;
  }

  return {
    ...stats,
    achievements: [...stats.achievements, achievement],
  };
}

export function removeAchievement(stats: UserStats, achievementId: string): UserStats {
  return {
    ...stats,
    achievements: stats.achievements.filter(a => a.id !== achievementId),
  };
}

// Query functions
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

export function hasLongestStreak(stats: UserStats): boolean {
  return stats.longestStreak > 0;
}

export function getAverageWorkoutDuration(stats: UserStats): number {
  if (stats.totalWorkouts === 0) return 0;
  return Math.round(stats.totalMinutes / stats.totalWorkouts);
}

export function getAverageVolumePerWorkout(stats: UserStats): number {
  if (stats.totalWorkouts === 0) return 0;
  return Math.round(stats.totalVolume / stats.totalWorkouts);
}

export function isCurrentlyOnStreak(stats: UserStats): boolean {
  return stats.currentStreak > 0;
}

export function getDaysSinceFirstWorkout(stats: UserStats): number {
  const today = new Date();
  const firstWorkoutDay = new Date(stats.firstWorkoutDate);
  firstWorkoutDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - firstWorkoutDay.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Comparison functions
export function equals(stats: UserStats, other: UserStats): boolean {
  if (!other) return false;

  return (
    stats.totalWorkouts === other.totalWorkouts &&
    stats.totalMinutes === other.totalMinutes &&
    stats.totalVolume === other.totalVolume &&
    stats.currentStreak === other.currentStreak &&
    stats.longestStreak === other.longestStreak &&
    stats.lastWorkoutDate?.getTime() === other.lastWorkoutDate?.getTime() &&
    stats.firstWorkoutDate.getTime() === other.firstWorkoutDate.getTime() &&
    stats.joinedAt.getTime() === other.joinedAt.getTime() &&
    stats.achievements.length === other.achievements.length &&
    stats.achievements.every((a, i) =>
      other.achievements[i]?.id === a.id &&
      other.achievements[i]?.type === a.type
    )
  );
}