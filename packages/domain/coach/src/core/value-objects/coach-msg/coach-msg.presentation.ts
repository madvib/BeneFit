import { z } from 'zod';
import { CoachActionPresentationSchema, toCoachActionPresentation } from '../coach-action/coach-action.presentation.js';
import { CoachMsg } from './coach-msg.types.js';

export const MessageRoleSchema = z.enum(['user', 'coach', 'system']);

export const CoachMsgPresentationSchema = z.object({
  id: z.string(),
  role: MessageRoleSchema,
  content: z.string().min(1).max(5000),
  actions: z.array(CoachActionPresentationSchema).optional(),
  checkInId: z.string().optional(),
  timestamp: z.iso.datetime(),
  // Note: 'tokens' field is intentionally omitted (implementation detail, not exposed in presentation)
});

export type CoachMsgPresentation = z.infer<typeof CoachMsgPresentationSchema>;

export function toCoachMsgPresentation(msg: CoachMsg): CoachMsgPresentation {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    actions: msg.actions?.map(toCoachActionPresentation),
    checkInId: msg.checkInId,
    timestamp: msg.timestamp.toISOString(),
    // tokens field is redacted - not included in presentation
  };
}
