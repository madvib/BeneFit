import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const activeWorkoutPlan = sqliteTable(
  'active_workout_plan',
  {
    id: text('id').primaryKey(),
    templateId: text('template_id'), // nullable
    startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
    currentWeek: integer('current_week').notNull(),
    status: text('status', { enum: ['active', 'paused', 'completed'] }).default('active'),
    weeksJson: text('weeks_json', { mode: 'json' }).notNull(), // full plan structure
    
    // LEGACY FIELDS (from plans.ts - workoutPlansMetadata) - Consider adding if needed:
    // name: text('name') - Plan name
    // status: text('status') - More statuses: 'draft', 'abandoned'
    // startedAt: integer('started_at', { mode: 'timestamp' }) - When actually started (vs created)
    // completedAt: integer('completed_at', { mode: 'timestamp' })
    // abandonedAt: integer('abandoned_at', { mode: 'timestamp' })
    // totalWeeks: integer('total_weeks') - Total weeks in plan
    // completedWorkouts: integer('completed_workouts').default(0) - Progress counter
    // totalScheduledWorkouts: integer('total_scheduled_workouts') - Total workouts in plan
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  }
);

export type ActiveWorkoutPlan = typeof activeWorkoutPlan.$inferSelect;
export type NewActiveWorkoutPlan = typeof activeWorkoutPlan.$inferInsert;
