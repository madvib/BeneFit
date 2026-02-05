import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const weeklySchedules = sqliteTable(
  'weekly_schedules',
  {
    id: text('id').primaryKey(),
    planId: text('plan_id').notNull(),
    weekNumber: integer('week_number').notNull(),
    startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
    focus: text('focus'),
    targetWorkouts: integer('target_workouts').notNull(),
    workoutsCompleted: integer('workouts_completed').default(0),
    notes: text('notes'),

    // Full workout structure for this week
    workoutsJson: text('workouts_json', { mode: 'json' }).notNull(), // WorkoutTemplate[]

    createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`),
  },
  (table) => [
    index('weekly_schedules_plan_id_idx').on(table.planId),
    index('weekly_schedules_plan_week_idx').on(table.planId, table.weekNumber),
  ]
);

export type WeeklySchedule = typeof weeklySchedules.$inferSelect;
export type NewWeeklySchedule = typeof weeklySchedules.$inferInsert;
