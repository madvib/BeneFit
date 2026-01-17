import { z } from 'zod';
import { UserStats } from './user-stats.types.js';

export const AchievementSchema = z.object({
  id: z.string(),
  type: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  earnedAt: z.iso.datetime(),
  iconUrl: z.string().url().optional(),
});

export const UserStatsSchema = z.object({
  totalWorkouts: z.number().int().min(0).max(100000),
  totalMinutes: z.number().int().min(0).max(10000000),
  totalVolume: z.number().min(0).max(100000000), // total kg lifted
  currentStreak: z.number().int().min(0).max(1000),
  longestStreak: z.number().int().min(0).max(1000),
  lastWorkoutDate: z.iso.datetime().optional(),
  achievements: z.array(AchievementSchema),
  firstWorkoutDate: z.iso.datetime(),
  joinedAt: z.iso.datetime(),
});

export type UserStatsPresentation = z.infer<typeof UserStatsSchema>;

export function toUserStatsSchema(stats: UserStats): UserStatsPresentation {
  return {
    totalWorkouts: stats.totalWorkouts,
    totalMinutes: stats.totalMinutes,
    totalVolume: stats.totalVolume,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    lastWorkoutDate: stats.lastWorkoutDate?.toISOString(),
    achievements: stats.achievements.map(a => ({
      ...a,
      earnedAt: a.earnedAt.toISOString(),
    })),
    firstWorkoutDate: stats.firstWorkoutDate.toISOString(),
    joinedAt: stats.joinedAt.toISOString(),
  };
}
