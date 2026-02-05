import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const workoutTemplates = sqliteTable(
  'workout_templates',
  {
    id: text('id').primaryKey(),
    planId: text('plan_id').notNull(),
    weekId: text('week_id').notNull(),
    weekNumber: integer('week_number').notNull(),
    dayOfWeek: integer('day_of_week').notNull(), // 0-6 (Sunday-Saturday)
    scheduledDate: text('scheduled_date').notNull(), // ISO date string

    // Workout details
    title: text('title').notNull(),
    description: text('description'),
    type: text('type').notNull(), // 'running' | 'cycling' | 'strength' | 'rest' | 'custom'
    category: text('category').notNull(), // 'cardio' | 'strength' | 'recovery'

    // Status and importance
    status: text('status').notNull(), // 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled'
    importance: text('importance').notNull(), // 'optional' | 'recommended' | 'key' | 'critical'

    // Workout structure
    goalsJson: text('goals_json', { mode: 'json' }), // WorkoutGoals
    activitiesJson: text('activities_json', { mode: 'json' }).notNull(), // WorkoutActivity[]
    alternativesJson: text('alternatives_json', { mode: 'json' }), // WorkoutAlternative[]

    // Completion and rescheduling
    completedWorkoutId: text('completed_workout_id'), // FK to completed_workouts
    rescheduledTo: text('rescheduled_to'), // ISO date string

    // Notes
    userNotes: text('user_notes'),
    coachNotes: text('coach_notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
      sql`(unixepoch())`),
  },
  (table) => [
    index('workout_templates_plan_id_idx').on(table.planId),
    index('workout_templates_week_id_idx').on(table.weekId),
    index('workout_templates_status_idx').on(table.status),
    index('workout_templates_scheduled_date_idx').on(table.scheduledDate),
    index('workout_templates_plan_week_day_idx').on(table.planId, table.weekNumber, table.dayOfWeek),
  ]
);

export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type NewWorkoutTemplate = typeof workoutTemplates.$inferInsert;
