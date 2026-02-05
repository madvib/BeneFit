import { z } from 'zod';
import type { CreateView, DomainBrandTag } from '@bene/shared';
import { CoachActionSchema } from '../coach-action/coach-action.types.js';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const MessageRoleSchema = z.enum(['user', 'coach', 'system']);

export const CoachMsgSchema = z
  .object({
    id: z.uuid(),
    role: MessageRoleSchema,
    content: z.string().min(1).max(2000),
    actions: z.array(CoachActionSchema).optional(),
    checkInId: z.uuid().optional(),
    timestamp: z.coerce.date<Date>(),
    tokens: z.number().int().min(0).optional(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type CoachMsg = Readonly<z.infer<typeof CoachMsgSchema>>;

/**
 * 3. VIEW TYPES (Serialized)
 */
export type CoachMsgView = CreateView<CoachMsg>;
