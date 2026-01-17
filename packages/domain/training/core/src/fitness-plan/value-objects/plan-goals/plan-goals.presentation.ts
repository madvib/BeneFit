import { z } from 'zod';

export const TargetLiftWeightSchema = z.object({
  exercise: z.string().min(1).max(100),
  weight: z.number().min(0).max(1000),
});

export const TargetDurationSchema = z.object({
  activity: z.string().min(1).max(100),
  duration: z.number().int().min(1).max(100000),
});

export const TargetMetricsSchema = z.object({
  targetWeights: z.array(TargetLiftWeightSchema).optional(),
  targetDuration: TargetDurationSchema.optional(),
  targetPace: z.number().min(0).max(1000).optional(),
  targetDistance: z.number().min(0).max(1000000).optional(),
  totalWorkouts: z.number().int().min(0).max(1000).optional(),
  minStreakDays: z.number().int().min(0).max(365).optional(),
});

export const PlanGoalsSchema = z.object({
  primary: z.string().min(1).max(200),
  secondary: z.array(z.string().min(1).max(200)),
  targetMetrics: TargetMetricsSchema,
  targetDate: z.iso.datetime().optional(),
});
