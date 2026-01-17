import { UserStats, Achievement, AchievementType } from './user-stats.types.js';

export function createUserStats(joinedAt: Date): UserStats {
  return {
    totalWorkouts: 0,
    totalMinutes: 0,
    totalVolume: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    firstWorkoutDate: joinedAt,
    joinedAt
  };
}

export function createAchievement(id: string, type: AchievementType, name: string, description: string): Achievement {
  return {
    id,
    type,
    name,
    description,
    earnedAt: new Date(),
  };
}