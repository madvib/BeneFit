import { z } from 'zod';
import { CoachActionSchema } from './coach-action.js';

// Check-in Schemas

export const CheckInTypeSchema = z.enum(['proactive', 'scheduled', 'user_initiated']);

export const CheckInTriggerSchema = z.enum([
  'low_adherence',
  'high_exertion',
  'injury_reported',
  'weekly_review',
  'milestone_achieved',
  'streak_broken',
  'difficulty_pattern',
  'enjoyment_declining',
]);

export const CheckInStatusSchema = z.enum(['pending', 'responded', 'dismissed']);

export const CheckInSchema = z.object({
  id: z.string(),
  type: CheckInTypeSchema,
  triggeredBy: CheckInTriggerSchema.optional(),
  // The check-in question/prompt
  question: z.string(),
  userResponse: z.string().optional(),
  // Coach's analysis and actions
  coachAnalysis: z.string().optional(),
  actions: z.array(CoachActionSchema),
  // Status
  status: CheckInStatusSchema,
  // Timestamps
  createdAt: z.string(), // ISO date string
  respondedAt: z.string().optional(), // ISO date string
  dismissedAt: z.string().optional(), // ISO date string
});

// Export inferred types
export type CheckInType = z.infer<typeof CheckInTypeSchema>;
export type CheckInTrigger = z.infer<typeof CheckInTriggerSchema>;
export type CheckInStatus = z.infer<typeof CheckInStatusSchema>;
export type CheckIn = z.infer<typeof CheckInSchema>;
