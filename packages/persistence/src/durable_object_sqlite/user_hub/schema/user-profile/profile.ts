import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { userStats } from './user_stats.ts';
import { achievements } from './achievements.ts';

export const profile = sqliteTable('profile', {
  userId: text('user_id').primaryKey().notNull(),

  // Personal info
  displayName: text('display_name').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  timezone: text('timezone').notNull().default('UTC'),

  preferencesJson: text('preferences_json', { mode: 'json' }),
  fitnessGoalsJson: text('fitness_goals_json', { mode: 'json' }),
  trainingConstraintsJson: text('training_constraints_json', { mode: 'json' }),
  experienceProfileJson: text('experience_profile_json', { mode: 'json' }),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const profileRelations = relations(profile, ({ one, many }) => ({
  stats: one(userStats, { fields: [profile.userId], references: [userStats.userId] }),
  achievements: many(achievements),
}));

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
