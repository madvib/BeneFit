import { z } from 'zod';
import type { CreateView, DomainBrandTag } from '@bene/shared';
import { CoachActionSchema } from '../coach-action/coach-action.types.js';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
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

export const CheckInSchema = z
  .object({
    id: z.uuid(),
    type: CheckInTypeSchema,
    triggeredBy: CheckInTriggerSchema.optional(),
    question: z.string().min(1).max(500),
    userResponse: z.string().optional(),
    coachAnalysis: z.string().optional(),
    actions: z.array(CoachActionSchema),
    status: CheckInStatusSchema,
    createdAt: z.coerce.date<Date>(),
    respondedAt: z.coerce.date<Date>().optional(),
    dismissedAt: z.coerce.date<Date>().optional(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type CheckInType = z.infer<typeof CheckInTypeSchema>;
export type CheckInTrigger = z.infer<typeof CheckInTriggerSchema>;
export type CheckInStatus = z.infer<typeof CheckInStatusSchema>;
export type CheckIn = Readonly<z.infer<typeof CheckInSchema>>;

/**
 * 3. VIEW TYPES (Serialized)
 */
export type CheckInView = CreateView<CheckIn>;
