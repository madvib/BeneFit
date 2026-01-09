import { z } from 'zod';

// Coach Action Schemas

export const CoachActionTypeSchema = z.enum([
  'adjusted_plan',
  'suggested_rest_day',
  'encouraged',
  'scheduled_followup',
  'recommended_deload',
  'modified_exercise',
  'celebrated_win',
]);

export const CoachActionSchema = z.object({
  type: CoachActionTypeSchema,
  details: z.string(),
  appliedAt: z.string(), // ISO date string
  planChangeId: z.string().optional(), // Reference to plan adjustment if applicable
});

// Export inferred types
export type CoachActionType = z.infer<typeof CoachActionTypeSchema>;
export type CoachAction = z.infer<typeof CoachActionSchema>;
