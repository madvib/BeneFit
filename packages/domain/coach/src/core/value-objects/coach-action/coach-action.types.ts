import { z } from 'zod';
import type { CreateView, DomainBrandTag } from '@bene/shared';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const CoachActionTypeSchema = z.enum([
  'adjusted_plan',
  'suggested_rest_day',
  'encouraged',
  'scheduled_followup',
  'recommended_deload',
  'modified_exercise',
  'celebrated_win',
]);

export const CoachActionSchema = z
  .object({
    type: CoachActionTypeSchema,
    details: z.string().min(1).max(500),
    appliedAt: z.coerce.date<Date>(),
    planChangeId: z.uuid().optional(), // Reference to plan adjustment if applicable
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type CoachActionType = z.infer<typeof CoachActionTypeSchema>;
export type CoachAction = Readonly<z.infer<typeof CoachActionSchema>>;

/**
 * 3. VIEW TYPES (Serialized)
 */
export type CoachActionView = CreateView<CoachAction>;
