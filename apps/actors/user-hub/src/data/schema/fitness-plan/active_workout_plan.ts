import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import {
  PlanType,
  PlanGoals,
  ProgressionStrategy,
  PlanPosition,
  PlanStatus,
  TrainingConstraints,
  WeeklySchedule,
} from '@bene/training-core';

export const activeFitnessPlan = sqliteTable('active_workout_plan', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),

  // Plan metadata
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  planType: text('plan_type').notNull().$type<PlanType>(), // 'event_training' | 'habit_building' | 'strength_program' | 'general_fitness'
  templateId: text('template_id'), // nullable - reference to plan_templates if created from template

  // Plan configuration - targetDate extracted for queryability
  targetDate: integer('target_date', { mode: 'timestamp_ms' }),
  goalsJson: text('goals_json', { mode: 'json' })
    .notNull()
    .$type<Omit<PlanGoals, 'targetDate'>>(),
  progressionJson: text('progression_json', { mode: 'json' }).notNull().$type<ProgressionStrategy>(), // ProgressionStrategy
  constraintsJson: text('constraints_json', { mode: 'json' }).notNull().$type<TrainingConstraints>(), // TrainingConstraints (or FK to training_constraints)

  // Current state
  currentPositionJson: text('current_position_json', { mode: 'json' }).notNull().$type<PlanPosition>(), // PlanPosition { week, day }
  status: text('status', {
    enum: ['draft', 'active', 'paused', 'completed', 'abandoned'],
  })
    .notNull()
    .default('draft')
    .$type<PlanStatus>(),

  // Progress tracking
  completedWorkouts: integer('completed_workouts').default(0),
  totalScheduledWorkouts: integer('total_scheduled_workouts'),

  // Dates
  startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp_ms' }),

  // Legacy: full plan structure (consider deprecating in favor of weekly_schedules table)
  weeksJson: text('weeks_json', { mode: 'json' }).notNull().default(sql`('[]')`).$type<WeeklySchedule[]>(), // full plan structure - now nullable

  // Lifecycle timestamps
  startedAt: integer('started_at', { mode: 'timestamp_ms' }), // When actually started (vs created)
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  abandonedAt: integer('abandoned_at', { mode: 'timestamp_ms' }),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(
    sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(
    sql`(unixepoch() * 1000)`),
});

export type ActiveFitnessPlan = typeof activeFitnessPlan.$inferSelect;
export type NewActiveFitnessPlan = typeof activeFitnessPlan.$inferInsert;
