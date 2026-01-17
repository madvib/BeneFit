import { z } from 'zod';
import { CoachActionPresentationSchema, toCoachActionPresentation } from '../coach-action/coach-action.presentation.js';
import { CheckIn } from './check-in.types.js';

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

export const CheckInPresentationSchema = z.object({
  id: z.string(),
  type: CheckInTypeSchema,
  triggeredBy: CheckInTriggerSchema.optional(),
  question: z.string().min(1).max(500),
  userResponse: z.string().min(1).max(2000).optional(),
  coachAnalysis: z.string().min(1).max(2000).optional(),
  actions: z.array(CoachActionPresentationSchema),
  status: CheckInStatusSchema,
  createdAt: z.iso.datetime(),
  respondedAt: z.iso.datetime().optional(),
  dismissedAt: z.iso.datetime().optional(),
});

export type CheckInPresentation = z.infer<typeof CheckInPresentationSchema>;

export function toCheckInPresentation(checkIn: CheckIn): CheckInPresentation {
  return {
    id: checkIn.id,
    type: checkIn.type,
    triggeredBy: checkIn.triggeredBy,
    question: checkIn.question,
    userResponse: checkIn.userResponse,
    coachAnalysis: checkIn.coachAnalysis,
    actions: checkIn.actions.map(toCoachActionPresentation),
    status: checkIn.status,
    createdAt: checkIn.createdAt.toISOString(),
    respondedAt: checkIn.respondedAt?.toISOString(),
    dismissedAt: checkIn.dismissedAt?.toISOString(),
  };
}
