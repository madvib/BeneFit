import { z } from 'zod';

export const PrimaryGoalSchema = z.enum([
  'strength',
  'endurance',
  'hypertrophy',
  'weight_loss',
  'maintenance',
  'athletic_performance',
]);

export const SecondaryGoalSchema = z.enum([
  'consistency',
  'flexibility',
  'mobility',
  'recovery',
  'injury_prevention',
]);

export const GoalSelectionSchema = z.object({
  goals: z.object({
    primary: PrimaryGoalSchema,
    secondary: z.array(SecondaryGoalSchema).default([]),
    targetMetrics: z.object({
      totalWorkouts: z.number().min(8).max(24), // 2-6 per week * 4 weeks
    }),
  }),
  customInstructions: z.string().optional(),
});

export const CheckInSchema = z.object({
  response: z.string().min(1, 'Response cannot be empty'),
});

export type GoalSelectionFormValues = z.infer<typeof GoalSelectionSchema>;
export type CheckInFormValues = z.infer<typeof CheckInSchema>;
