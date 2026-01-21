import { z } from 'zod';
import { CreateView } from '@bene/shared';

export const AchievementTypeSchema = z.enum([
  'first_workout',
  'streak_7',
  'streak_30',
  'pr_strength',
  'pr_distance',
  'ten_workouts',
  'fifty_workouts',
  '100_workouts',
  'plan_completed',
]);

export type AchievementType = z.infer<typeof AchievementTypeSchema>;

/**
 * ACHIEVEMENT SCHEMA
 */
export const AchievementSchema = z.object({
  id: z.uuid(),
  type: AchievementTypeSchema,
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  earnedAt: z.coerce.date<Date>(),
  iconUrl: z.url().optional(),
});

export type Achievement = Readonly<z.infer<typeof AchievementSchema>>;
export type AchievementView = CreateView<Achievement>;

/**
 * USER STATS SCHEMA
 */
export const UserStatsSchema = z.object({
  // Workout metrics
  totalWorkouts: z.number().int().min(0).max(100000),
  totalMinutes: z.number().int().min(0).max(10000000),
  totalVolume: z.number().min(0).max(100000000), // kg lifted

  // Streaks
  currentStreak: z.number().int().min(0).max(1000),
  longestStreak: z.number().int().min(0).max(1000),
  lastWorkoutDate: z.coerce.date<Date>().optional(),

  // Achievements
  achievements: z.array(AchievementSchema),

  // Milestones
  firstWorkoutDate: z.coerce.date<Date>(),
  joinedAt: z.coerce.date<Date>(),
});

export type UserStats = Readonly<z.infer<typeof UserStatsSchema>>;
