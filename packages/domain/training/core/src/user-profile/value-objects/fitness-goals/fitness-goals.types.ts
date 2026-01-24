import { z } from 'zod';
import { CreateView, FITNESS_GOALS, WEIGHT_UNITS } from '@bene/shared';

export const PrimaryFitnessGoalSchema = z.enum(FITNESS_GOALS);
export type PrimaryFitnessGoal = z.infer<typeof PrimaryFitnessGoalSchema>;

export const TargetWeightSchema = z.object({
  current: z.number().min(20).max(500),
  target: z.number().min(20).max(500),
  unit: z.enum(WEIGHT_UNITS),
});
export type TargetWeight = z.infer<typeof TargetWeightSchema>;

/**
 * CORE SCHEMA
 */
export const FitnessGoalsSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string().min(1).max(100)),
  targetWeight: TargetWeightSchema.optional(),
  targetBodyFat: z.number().min(1).max(60).optional(),
  targetDate: z.coerce.date<Date>().optional(),
  motivation: z.string().min(1).max(1000),
  successCriteria: z.array(z.string().min(1).max(200)),
});

/**
 * INFERRED TYPES
 */
export type FitnessGoals = Readonly<z.infer<typeof FitnessGoalsSchema>>;
export type FitnessGoalsView = CreateView<FitnessGoals>;
