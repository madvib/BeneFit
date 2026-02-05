import { DomainBrandTag } from '@bene/shared';
import { z } from 'zod';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const TargetLiftWeightSchema = z.object({
  exercise: z.string().min(1).max(100),
  weight: z.number().min(0).max(1000), // kg or lbs
});

export const TargetDurationSchema = z.object({
  activity: z.string().min(1).max(100),
  duration: z.number().int().min(1).max(100000), // minutes
});

export const TargetMetricsSchema = z
  .object({
    targetWeights: z.array(TargetLiftWeightSchema).optional(),
    targetDuration: TargetDurationSchema.optional(),
    targetPace: z.number().min(0).max(1000).optional(), // seconds per km/mile
    targetDistance: z.number().min(0).max(1000000).optional(), // meters
    totalWorkouts: z.number().int().min(0).max(1000).optional(), // for consistency goals
    minStreakDays: z.number().int().min(0).max(365).optional(), // for habit building
  })

export const PlanGoalsSchema = z
  .object({
    primary: z.string().min(1).max(200),
    secondary: z.array(z.string().min(1).max(200)),
    targetMetrics: TargetMetricsSchema,
    targetDate: z.coerce.date<Date>().optional(),
  })
  .brand<DomainBrandTag>();


export type TargetLiftWeight = z.infer<typeof TargetLiftWeightSchema>;
export type TargetDuration = z.infer<typeof TargetDurationSchema>;
export type TargetMetrics = z.infer<typeof TargetMetricsSchema>;
export type PlanGoals = Readonly<z.infer<typeof PlanGoalsSchema>>;

