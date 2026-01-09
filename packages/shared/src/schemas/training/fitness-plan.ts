import { z } from 'zod';
import { PlanGoalsSchema } from './plan-goals.js';
import { ProgressionStrategySchema } from './progression-strategy.js';
import { TrainingConstraintsSchema } from './training-constraints.js';

export const WorkoutSummarySchema = z.object({
  id: z.string(),
  type: z.string(),
  dayOfWeek: z.number(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'skipped', 'rescheduled']),
  durationMinutes: z.number().optional(),
});

export const WeekSchema = z.object({
  weekNumber: z.number(),
  workouts: z.array(WorkoutSummarySchema),
});

export const PlanSummarySchema = z.object({
  total: z.number(),
  completed: z.number(),
});

export const PlanTypeSchema = z.enum([
  'event_training',
  'habit_building',
  'strength_program',
  'general_fitness',
]);

export const PlanPositionSchema = z.object({
  week: z.number(),
  day: z.number(), // 0-6 (Sunday-Saturday)
});

export const FitnessPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  planType: PlanTypeSchema,
  durationWeeks: z.number(),
  currentWeek: z.number(),
  currentPosition: PlanPositionSchema,
  status: z.enum(['draft', 'active', 'paused', 'completed', 'abandoned']),
  startDate: z.string(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  startedAt: z.string().optional(), // ISO date string (when user started)
  weeks: z.array(WeekSchema),
  summary: PlanSummarySchema,
  goals: PlanGoalsSchema,
  progression: ProgressionStrategySchema,
  constraints: TrainingConstraintsSchema,
});

export type WorkoutSummary = z.infer<typeof WorkoutSummarySchema>;
export type Week = z.infer<typeof WeekSchema>;
export type PlanSummary = z.infer<typeof PlanSummarySchema>;
export type PlanType = z.infer<typeof PlanTypeSchema>;
export type PlanPosition = z.infer<typeof PlanPositionSchema>;
export type FitnessPlan = z.infer<typeof FitnessPlanSchema>;
