import { z } from 'zod';
import { FITNESS_GOALS } from '../../index.js';

// Goal selection form schemas
// Used in plan generation and goal updates

export const GoalSelectionFormSchema = z.object({
  goals: z.object({
    primary: z.enum(FITNESS_GOALS as unknown as [string, ...string[]]),
    secondary: z.array(z.string()).default([]),
    targetMetrics: z.object({
      totalWorkouts: z.number().min(8).max(24), // 2-6 per week * 4 weeks
    }),
  }),
  customInstructions: z.string().optional(),
});

export const CheckInFormSchema = z.object({
  response: z.string().min(1, 'Response cannot be empty'),
});

export type GoalSelectionFormValues = z.infer<typeof GoalSelectionFormSchema>;
export type CheckInFormValues = z.infer<typeof CheckInFormSchema>;
