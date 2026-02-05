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