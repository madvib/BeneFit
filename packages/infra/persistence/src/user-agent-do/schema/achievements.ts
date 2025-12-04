import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const achievements = sqliteTable(
  'achievements',
  {
    id: text('id').primaryKey(),
    achievementType: text('achievement_type', { enum: ['first_workout', 'streak_7', 'streak_30', 'pr_strength', 'pr_distance', '100_workouts', 'plan_completed'] }).notNull(),
    earnedAt: integer('earned_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    metadataJson: text('metadata_json', { mode: 'json' }), // achievement-specific data
  }
);

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
