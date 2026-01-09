import { z } from 'zod';
import { PrimaryFitnessGoalSchema } from './fitness-goals.js';

// Plan Goals Schemas

export const TargetLiftWeightSchema = z.object({
  exercise: z.string(),
  weight: z.number(), // kg or lbs
});

export const TargetDurationSchema = z.object({
  activity: z.string(),
  duration: z.number(), // minutes
});

export const TargetMetricsSchema = z.object({
  targetWeights: z.array(TargetLiftWeightSchema).optional(),
  targetDuration: TargetDurationSchema.optional(),
  targetPace: z.number().optional(), // seconds per km/mile
  targetDistance: z.number().optional(), // meters for running/cycling goals
  totalWorkouts: z.number().optional(), // for consistency goals
  minStreakDays: z.number().optional(), // for habit building
});

export const PlanGoalsSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string()),
  targetMetrics: TargetMetricsSchema,
  targetDate: z.string().optional(), // Date serialized as ISO string
});

export type TargetLiftWeight = z.infer<typeof TargetLiftWeightSchema>;
export type TargetDuration = z.infer<typeof TargetDurationSchema>;
export type TargetMetrics = z.infer<typeof TargetMetricsSchema>;
export type PlanGoals = z.infer<typeof PlanGoalsSchema>;
