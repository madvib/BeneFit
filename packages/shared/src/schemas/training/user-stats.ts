import { z } from 'zod';
import { AchievementSchema } from './common.js';

// User Stats Schemas

export const UserStatsSchema = z.object({
  // Workout metrics
  totalWorkouts: z.number(),
  totalMinutes: z.number(),
  totalVolume: z.number(), // kg lifted
  // Streaks
  currentStreak: z.number(), // Days
  longestStreak: z.number(), // Days
  lastWorkoutDate: z.string().optional(), // ISO date string
  // Achievements
  achievements: z.array(AchievementSchema),
  // Milestones
  firstWorkoutDate: z.string(), // ISO date string
  joinedAt: z.string(), // ISO date string
});

// Export inferred types
export type UserStats = z.infer<typeof UserStatsSchema>;
