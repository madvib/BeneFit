import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { userProfiles } from './profiles.js';
import { achievements } from './social.js';
import { workoutPlansMetadata } from './plans.js';
import { completedWorkouts } from './workouts.js';
import { workoutReactions } from './workouts.js';
import { coachingConversations } from './coaching.js';
import { connectedServices } from './integrations.js';
import { teams } from './social.js';
import { teamMembers } from './social.js';

// Auth managed by Better Auth, but we need the reference
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  achievements: many(achievements),
  plans: many(workoutPlansMetadata),
  workouts: many(completedWorkouts),
  reactions: many(workoutReactions),
  coachingConversation: one(coachingConversations, {
    fields: [users.id],
    references: [coachingConversations.userId],
  }),
  connectedServices: many(connectedServices),
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;