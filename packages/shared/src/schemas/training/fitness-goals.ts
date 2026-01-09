import { z } from 'zod';
import { FITNESS_GOALS } from '../../constants/index.js';
import { TargetWeightSchema } from './common.js';

// Fitness Goals Schemas

export const PrimaryFitnessGoalSchema = z.enum(FITNESS_GOALS as unknown as [string, ...string[]]);

export const FitnessGoalsSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string()), // Additional goals
  // Specific targets
  targetWeight: TargetWeightSchema.optional(),
  targetBodyFat: z.number().optional(), // Percentage
  targetDate: z.string().optional(), // Date serialized as ISO string
  // Qualitative
  motivation: z.string(), // Why they're doing this
  successCriteria: z.array(z.string()), // How they'll know they succeeded
});

export type PrimaryFitnessGoal = z.infer<typeof PrimaryFitnessGoalSchema>;
export type FitnessGoals = z.infer<typeof FitnessGoalsSchema>;
