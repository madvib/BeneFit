import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { userStats } from './user_stats';
import { achievements } from './achievements';
import {
  ExperienceProfile,
  FitnessGoals,
  TrainingConstraints,
  UserPreferences,
} from '@bene/training-core';

export const profile = sqliteTable('profile', {
  userId: text('user_id').primaryKey().notNull(),

  // Personal info
  displayName: text('display_name').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  timezone: text('timezone').notNull().default('UTC'),

  preferencesJson: text('preferences_json', { mode: 'json' })
    .notNull()
    .$type<UserPreferences>(),

  // Fitness goals - target date extracted
  fitnessGoalsTargetDate: integer('fitness_goals_target_date', { mode: 'timestamp_ms' }),
  fitnessGoalsJson: text('fitness_goals_json', { mode: 'json' })
    .notNull()
    .$type<Omit<FitnessGoals, 'targetDate'>>(),
  trainingConstraintsJson: text('training_constraints_json', {
    mode: 'json',
  })
    .notNull()
    .$type<TrainingConstraints>(),

  // Experience profile - lastAssessmentDate extracted for queryability
  lastAssessmentDate: integer('last_assessment_date', { mode: 'timestamp_ms' }).notNull(),
  experienceProfileJson: text('experience_profile_json', {
    mode: 'json',
  })
    .notNull()
    .$type<Omit<ExperienceProfile, 'lastAssessmentDate'>>(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const profileRelations = relations(profile, ({ one, many }) => ({
  stats: one(userStats, { fields: [profile.userId], references: [userStats.userId] }),
  achievements: many(achievements),
}));

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
