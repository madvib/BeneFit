import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { profile } from './profile.ts';

export const userStats = sqliteTable(
  'user_stats',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => profile.userId, { onDelete: 'cascade' }),
    displayName: text('display_name'),

    // streaks
    currentStreakDays: integer('current_streak_days').default(0).notNull(),
    longestStreakDays: integer('longest_streak_days').default(0).notNull(),
    lastWorkoutDate: integer('last_workout_date', { mode: 'number' }),

    // metrics
    totalWorkoutsCompleted: integer('total_workouts_completed').default(0).notNull(),
    totalMinutesTrained: integer('total_minutes_trained').default(0).notNull(),
    totalVolumeKg: integer('total_volume_kg').default(0).notNull(),
    totalDistanceMeters: integer('total_distance_meters').default(0).notNull(),
    totalCaloriesBurned: integer('total_calories_burned').default(0).notNull(),

    updatedAt: integer('updated_at', { mode: 'number' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('user_stats_total_workouts_idx').on(
      table.totalWorkoutsCompleted,
    ),
    index('user_stats_current_streak_idx').on(
      table.currentStreakDays,
    ),
  ],
);

export const userStatsRelations = relations(userStats, ({ one }) => ({
  profile: one(profile, {
    fields: [userStats.userId],
    references: [profile.userId],
  }),
}));

export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;
