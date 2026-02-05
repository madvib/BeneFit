import { z } from 'zod';
import { FITNESS_GOALS, SECONDARY_GOALS, WEIGHT_UNITS } from '@bene/shared';

export type PrimaryFitnessGoal = typeof FITNESS_GOALS[number];
export type SecondaryFitnessGoal = typeof SECONDARY_GOALS[number];

export const UpdateFitnessGoalsFormSchema = z.object({
  primary: z.enum(FITNESS_GOALS),
  secondary: z.array(z.enum(SECONDARY_GOALS)),
  targetWeight: z.object({
    current: z.number().min(20).max(500),
    target: z.number().min(20).max(500),
    unit: z.enum(WEIGHT_UNITS),
  }).optional(),
  targetBodyFat: z.number().min(1).max(60).optional(),
  targetDate: z.coerce.date().optional(),
  motivation: z.string().min(1).max(1000),
  successCriteria: z.array(z.string().min(1).max(200)),
});

export type UpdateFitnessGoalsFormValues = z.infer<typeof UpdateFitnessGoalsFormSchema>;
