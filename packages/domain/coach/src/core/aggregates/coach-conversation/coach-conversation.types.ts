import { z } from 'zod';
import type { DomainBrandTag } from '@bene/shared';
import { CoachContextSchema, CoachMsgSchema, CheckInSchema } from '../../value-objects/index.js';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const CoachConversationSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    context: CoachContextSchema,
    messages: z.array(CoachMsgSchema),
    checkIns: z.array(CheckInSchema),
    totalMessages: z.number().int().min(0),
    totalUserMessages: z.number().int().min(0),
    totalCoachMessages: z.number().int().min(0),
    totalCheckIns: z.number().int().min(0),
    pendingCheckIns: z.number().int().min(0),
    startedAt: z.coerce.date<Date>(),
    lastMessageAt: z.coerce.date<Date>(),
    lastContextUpdateAt: z.coerce.date<Date>(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type CoachConversation = Readonly<z.infer<typeof CoachConversationSchema>>;

