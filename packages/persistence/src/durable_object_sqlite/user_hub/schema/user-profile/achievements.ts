import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { profile } from './profile.ts';

export const achievements = sqliteTable(
  'achievements',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => profile.userId, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description').notNull(),
    iconUrl: text('icon_url'),
    achievementType: text('achievement_type', {
      enum: [
        'first_workout',
        'streak_7',
        'streak_30',
        'pr_strength',
        'pr_distance',
        '100_workouts',
        'plan_completed',
      ],
    }).notNull(),
    earnedAt: integer('earned_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    metadataJson: text('metadata_json', { mode: 'json' }), // achievement-specific data
  },
  (table) => [
    index('achievements_user_id_idx').on(table.userId),
  ],
);
export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(profile, {
    fields: [achievements.userId],
    references: [profile.userId],
  }),
}));

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
