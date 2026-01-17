import { z } from 'zod';
import { CoachAction } from './coach-action.types.js';

export const CoachActionTypeSchema = z.enum([
  'adjusted_plan',
  'suggested_rest_day',
  'encouraged',
  'scheduled_followup',
  'recommended_deload',
  'modified_exercise',
  'celebrated_win',
]);

export const CoachActionPresentationSchema = z.object({
  type: CoachActionTypeSchema,
  details: z.string().min(1).max(1000),
  appliedAt: z.iso.datetime(),
  planChangeId: z.string().optional(),
});

export type CoachActionPresentation = z.infer<typeof CoachActionPresentationSchema>;

export function toCoachActionPresentation(action: CoachAction): CoachActionPresentation {
  return {
    type: action.type,
    details: action.details,
    appliedAt: action.appliedAt.toISOString(),
    planChangeId: action.planChangeId,
  };
}
