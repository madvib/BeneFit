import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { achievements } from './social.js';

export const userProfiles = sqliteTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),

  // Personal info
  displayName: text('display_name').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  location: text('location'),
  timezone: text('timezone').notNull(),

  // Fitness profile (JSON serialized)
  experienceProfile: text('experience_profile', { mode: 'json' }).notNull(), // ExperienceProfile
  fitnessGoals: text('fitness_goals', { mode: 'json' }).notNull(), // FitnessGoals
  trainingConstraints: text('training_constraints', { mode: 'json' }).notNull(), // TrainingConstraints

  // Preferences (JSON serialized)
  preferences: text('preferences', { mode: 'json' }).notNull(), // UserPreferences

  // Stats
  totalWorkouts: integer('total_workouts').notNull().default(0),
  totalMinutes: integer('total_minutes').notNull().default(0),
  totalVolume: real('total_volume').notNull().default(0), // kg lifted
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastWorkoutDate: integer('last_workout_date', { mode: 'timestamp' }),

  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
  lastActiveIdx: index('user_profiles_last_active_idx').on(table.lastActiveAt),
}));

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text('achievement_type').notNull(), // "first_workout", "10_workouts", etc.
  name: text('name').notNull(),
  description: text('description').notNull(),
  iconUrl: text('icon_url'),
  earnedAt: integer('earned_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('achievements_user_id_idx').on(table.userId),
  earnedAtIdx: index('achievements_earned_at_idx').on(table.earnedAt),
}));

export const userProfilesRelations = relations(userProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
  achievements: many(achievements),
}));

// Type exports
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;