import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { AchievementType } from '@bene/training-core';
import { profile } from './profile';

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
    achievementType: text('achievement_type').notNull().$type<AchievementType>(),
    earnedAt: integer('earned_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    metadataJson: text('metadata_json', { mode: 'json' }), // achievement-specific data
  },
  (table) => [index('achievements_user_id_idx').on(table.userId)],
);
export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(profile, {
    fields: [achievements.userId],
    references: [profile.userId],
  }),
}));

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
