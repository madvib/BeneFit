import { z } from 'zod';
import { FitnessGoals } from './fitness-goals.types.js';

export const PrimaryFitnessGoalSchema = z.enum([
  'strength',
  'hypertrophy',
  'endurance',
  'weight_loss',
  'weight_gain',
  'general_fitness',
  'sport_specific',
  'mobility',
  'rehabilitation',
]);

export const TargetWeightSchema = z.object({
  current: z.number().min(30).max(300),
  target: z.number().min(30).max(300),
  unit: z.enum(['kg', 'lbs']),
});

export const FitnessGoalsSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string().min(1).max(100)),
  targetWeight: TargetWeightSchema.optional(),
  targetBodyFat: z.number().min(3).max(60).optional(),
  targetDate: z.iso.datetime().optional(),
  motivation: z.string().min(1).max(1000),
  successCriteria: z.array(z.string().min(1).max(500)),
});

type FitnessGoalsPresentation = z.infer<typeof FitnessGoalsSchema>;

// DOMAIN to PRESENTATION (Schema)
export function toFitnessGoalsSchema(goals: FitnessGoals): FitnessGoalsPresentation {
  return {
    primary: goals.primary,
    secondary: [...goals.secondary],
    targetWeight: goals.targetWeight ? { ...goals.targetWeight } : undefined,
    targetBodyFat: goals.targetBodyFat,
    targetDate: goals.targetDate?.toISOString(),
    motivation: goals.motivation,
    successCriteria: [...goals.successCriteria],
  };
}

// PRESENTATION (Schema) to DOMAIN
export function fromFitnessGoalsSchema(schema: FitnessGoalsPresentation): FitnessGoals {
  return {
    primary: schema.primary,
    secondary: [...schema.secondary],
    targetWeight: schema.targetWeight ? { ...schema.targetWeight } : undefined,
    targetBodyFat: schema.targetBodyFat,
    targetDate: schema.targetDate ? new Date(schema.targetDate) : undefined,
    motivation: schema.motivation,
    successCriteria: [...schema.successCriteria],
  };
}
