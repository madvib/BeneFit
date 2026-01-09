import { z } from 'zod';
import { PlanGoalsSchema } from './plan-goals.js';
import { ProgressionStrategySchema } from './progression-strategy.js';
import { TrainingConstraintsSchema } from './training-constraints.js';

import { WeeklyScheduleSchema } from './weekly-schedule.js';

export const WeekSchema = WeeklyScheduleSchema; // Alias for backward compatibility if needed, or just use WeeklyScheduleSchema

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
  weeks: z.array(WeeklyScheduleSchema),
  summary: PlanSummarySchema,
  goals: PlanGoalsSchema,
  progression: ProgressionStrategySchema,
  constraints: TrainingConstraintsSchema,
});

export type Week = z.infer<typeof WeeklyScheduleSchema>;
export type PlanSummary = z.infer<typeof PlanSummarySchema>;
export type PlanType = z.infer<typeof PlanTypeSchema>;
export type PlanPosition = z.infer<typeof PlanPositionSchema>;
export type FitnessPlan = z.infer<typeof FitnessPlanSchema>;
