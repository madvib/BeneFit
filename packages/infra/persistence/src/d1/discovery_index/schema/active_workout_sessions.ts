import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const activeWorkoutSessions = sqliteTable(
  'active_workout_sessions',
  {
    id: text('id').primaryKey(),
    createdByUserId: text('created_by_user_id').notNull(),
    workoutId: text('workout_id').notNull(),
    sessionStartedAt: integer('session_started_at', { mode: 'number' }).notNull(),
    participantCount: integer('participant_count').default(1),
    status: text('status', { enum: ['active', 'completed'] }).default('active'),
    doSessionId: text('do_session_id').notNull(), // Reference to WorkoutSessionAgent DO
    createdAt: integer('created_at', { mode: 'number' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'number' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('active_workout_sessions_created_by_user_idx').on(table.createdByUserId),
  ]
);

export type ActiveWorkoutSession = typeof activeWorkoutSessions.$inferSelect;
export type NewActiveWorkoutSession = typeof activeWorkoutSessions.$inferInsert;
