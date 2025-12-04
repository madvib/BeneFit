import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const profile = sqliteTable(
  'profile',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').unique().notNull(),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    location: text('location'),
    timezone: text('timezone').notNull().default('UTC'),
    experienceLevel: text('experience_level', { enum: ['beginner', 'intermediate', 'advanced'] }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    lastActiveAt: integer('last_active_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    
    // LEGACY FIELDS (from profiles.ts) - Consider adding if needed:
    // experienceProfile: text('experience_profile', { mode: 'json' }) - Full experience profile object
    // fitnessGoals: text('fitness_goals', { mode: 'json' }) - Goals as single JSON (now in fitness_goals table)
    // trainingConstraints: text('training_constraints', { mode: 'json' }) - Constraints as JSON (now in training_constraints table)
    // preferences: text('preferences', { mode: 'json' }) - Preferences as JSON (now in preferences table)
    // Stats fields (consider if needed alongside user_stats in core-d1):
    //   totalWorkouts, totalMinutes, totalVolume, currentStreak, longestStreak, lastWorkoutDate
  }
);

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
