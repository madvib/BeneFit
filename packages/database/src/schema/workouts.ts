import { sqliteTable, text, integer, real, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { workoutPlansMetadata } from './plans.js';

export const completedWorkouts = sqliteTable('completed_workouts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Plan reference
  planId: text('plan_id').references(() => workoutPlansMetadata.id, { onDelete: 'set null' }),
  workoutTemplateId: text('workout_template_id'),
  weekNumber: integer('week_number'),
  dayNumber: integer('day_number'),

  // Workout details
  workoutType: text('workout_type').notNull(),
  description: text('description'),

  // Performance (JSON serialized)
  performance: text('performance', { mode: 'json' }).notNull(), // WorkoutPerformance

  // Verification (JSON serialized)
  verification: text('verification', { mode: 'json' }).notNull(), // WorkoutVerification

  // Social
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  reactionCount: integer('reaction_count').notNull().default(0),

  // Multiplayer
  multiplayerSessionId: text('multiplayer_session_id'),

  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(), // When workout actually happened
}, (table) => ({
  userIdIdx: index('completed_workouts_user_id_idx').on(table.userId),
  planIdIdx: index('completed_workouts_plan_id_idx').on(table.planId),
  recordedAtIdx: index('completed_workouts_recorded_at_idx').on(table.recordedAt),
  userRecordedIdx: index('completed_workouts_user_recorded_idx').on(table.userId, table.recordedAt),
  publicIdx: index('completed_workouts_public_idx').on(table.isPublic),
}));

export const workoutReactions = sqliteTable('workout_reactions', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => completedWorkouts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  userName: text('user_name').notNull(),
  reactionType: text('reaction_type').notNull(), // 'fire' | 'strong' | 'clap' | 'heart' | 'smile'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  workoutIdIdx: index('workout_reactions_workout_id_idx').on(table.workoutId),
  userWorkoutIdx: index('workout_reactions_user_workout_idx').on(table.userId, table.workoutId),
}));

export const completedWorkoutsRelations = relations(completedWorkouts, ({ one, many }) => ({
  user: one(users, {
    fields: [completedWorkouts.userId],
    references: [users.id],
  }),
  plan: one(workoutPlansMetadata, {
    fields: [completedWorkouts.planId],
    references: [workoutPlansMetadata.id],
  }),
  reactions: many(workoutReactions),
}));

export const workoutReactionsRelations = relations(workoutReactions, ({ one }) => ({
  workout: one(completedWorkouts, {
    fields: [workoutReactions.workoutId],
    references: [completedWorkouts.id],
  }),
  user: one(users, {
    fields: [workoutReactions.userId],
    references: [users.id],
  }),
}));

// Type exports
export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type NewCompletedWorkout = typeof completedWorkouts.$inferInsert;

export type WorkoutReaction = typeof workoutReactions.$inferSelect;
export type NewWorkoutReaction = typeof workoutReactions.$inferInsert;