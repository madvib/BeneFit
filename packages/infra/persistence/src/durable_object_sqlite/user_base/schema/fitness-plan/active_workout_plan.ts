import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const activeFitnessPlan = sqliteTable('active_workout_plan', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),

  // Plan metadata
  title: text('title').notNull(),
  description: text('description'),
  planType: text('plan_type').notNull(), // 'event_training' | 'habit_building' | 'strength_program' | 'general_fitness'
  templateId: text('template_id'), // nullable - reference to plan_templates if created from template

  // Plan configuration
  goalsJson: text('goals_json', { mode: 'json' }).notNull(), // PlanGoals
  progressionJson: text('progression_json', { mode: 'json' }).notNull(), // ProgressionStrategy
  constraintsJson: text('constraints_json', { mode: 'json' }), // TrainingConstraints (or FK to training_constraints)

  // Current state
  currentPositionJson: text('current_position_json', { mode: 'json' }).notNull(), // PlanPosition { week, day }
  status: text('status', {
    enum: ['draft', 'active', 'paused', 'completed', 'abandoned'],
  }).default('draft'),

  // Progress tracking
  completedWorkouts: integer('completed_workouts').default(0),
  totalScheduledWorkouts: integer('total_scheduled_workouts'),

  // Dates
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),

  // Legacy: full plan structure (consider deprecating in favor of weekly_schedules table)
  weeksJson: text('weeks_json', { mode: 'json' }), // full plan structure - now nullable

  // Lifecycle timestamps
  startedAt: integer('started_at', { mode: 'timestamp' }), // When actually started (vs created)
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  abandonedAt: integer('abandoned_at', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`),
});

export type ActiveFitnessPlan = typeof activeFitnessPlan.$inferSelect;
export type NewActiveFitnessPlan = typeof activeFitnessPlan.$inferInsert;
