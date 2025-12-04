import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const userStats = sqliteTable(
  'user_stats',
  {
    userId: text('user_id').primaryKey(),
    displayName: text('display_name'),
    currentStreakDays: integer('current_streak_days').default(0),
    longestStreakDays: integer('longest_streak_days').default(0),
    totalWorkoutsCompleted: integer('total_workouts_completed').default(0),
    totalVolumeLifetime: integer('total_volume_lifetime').default(0), // bigint in GUIDE, but sqlite integer is up to 8 bytes (signed 64-bit)
    totalDistanceMeters: integer('total_distance_meters').default(0),
    totalCaloriesBurned: integer('total_calories_burned').default(0),
    lastWorkoutAt: integer('last_workout_at', { mode: 'timestamp' }),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    totalWorkoutsIdx: index('user_stats_total_workouts_idx').on(table.totalWorkoutsCompleted),
    currentStreakIdx: index('user_stats_current_streak_idx').on(table.currentStreakDays),
  })
);

export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;
