import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const sessionMetadata = sqliteTable(
  'session_metadata',
  {
    id: text('id').primaryKey(),
    createdByUserId: text('created_by_user_id').notNull(),
    
    // Workout reference
    workoutId: text('workout_id').notNull(),
    planId: text('plan_id'),
    workoutTemplateId: text('workout_template_id'),
    workoutType: text('workout_type').notNull(),
    
    // State
    status: text('status', { enum: ['preparing', 'in_progress', 'paused', 'completed', 'abandoned'] }).default('preparing'),
    currentActivityIndex: integer('current_activity_index').default(0),
    
    // Timing
    startedAt: integer('started_at', { mode: 'timestamp' }),
    pausedAt: integer('paused_at', { mode: 'timestamp' }),
    resumedAt: integer('resumed_at', { mode: 'timestamp' }),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    abandonedAt: integer('abandoned_at', { mode: 'timestamp' }),
    totalPausedSeconds: integer('total_paused_seconds').default(0),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  }
);

export type SessionMetadata = typeof sessionMetadata.$inferSelect;
export type NewSessionMetadata = typeof sessionMetadata.$inferInsert;
