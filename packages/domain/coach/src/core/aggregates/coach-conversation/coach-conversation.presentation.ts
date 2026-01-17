import { z } from 'zod';
import {
  CoachContextPresentationSchema,
  toCoachContextPresentation,
} from '../../value-objects/coach-context/coach-context.presentation.js';
import {
  CoachMsgPresentationSchema,
  toCoachMsgPresentation,
} from '../../value-objects/coach-msg/coach-msg.presentation.js';
import {
  CheckInPresentationSchema,
  toCheckInPresentation,
} from '../../value-objects/check-in/check-in.presentation.js';
import { CoachConversation } from './coach-conversation.types.js';
import * as Queries from './coach-conversation.queries.js';

export const CoachConversationPresentationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  context: CoachContextPresentationSchema,
  messages: z.array(CoachMsgPresentationSchema),
  checkIns: z.array(CheckInPresentationSchema),
  totalMessages: z.number().int().min(0).max(100000),
  totalUserMessages: z.number().int().min(0).max(100000),
  totalCoachMessages: z.number().int().min(0).max(100000),
  totalCheckIns: z.number().int().min(0).max(10000),
  pendingCheckIns: z.number().int().min(0).max(100),
  startedAt: z.iso.datetime(),
  lastMessageAt: z.iso.datetime(),
  lastContextUpdateAt: z.iso.datetime(),
  // Computed / Enriched Fields
  latestMessage: CoachMsgPresentationSchema.optional(),
  pendingCheckInsList: z.array(CheckInPresentationSchema),
  conversationDurationDays: z.number().int().min(0).max(10000),
});

export type CoachConversationPresentation = z.infer<typeof CoachConversationPresentationSchema>;

export function toCoachConversationPresentation(
  conversation: CoachConversation
): CoachConversationPresentation {
  const latestMessage = Queries.getLatestMessage(conversation);
  const pendingCheckInsList = Queries.getPendingCheckIns(conversation);
  const conversationDurationDays = Math.floor(
    (new Date().getTime() - conversation.startedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    id: conversation.id,
    userId: conversation.userId,
    context: toCoachContextPresentation(conversation.context),
    messages: conversation.messages.map(toCoachMsgPresentation),
    checkIns: conversation.checkIns.map(toCheckInPresentation),
    totalMessages: conversation.totalMessages,
    totalUserMessages: conversation.totalUserMessages,
    totalCoachMessages: conversation.totalCoachMessages,
    totalCheckIns: conversation.totalCheckIns,
    pendingCheckIns: conversation.pendingCheckIns,
    startedAt: conversation.startedAt.toISOString(),
    lastMessageAt: conversation.lastMessageAt.toISOString(),
    lastContextUpdateAt: conversation.lastContextUpdateAt.toISOString(),
    // Computed
    latestMessage: latestMessage ? toCoachMsgPresentation(latestMessage) : undefined,
    pendingCheckInsList: pendingCheckInsList.map(toCheckInPresentation),
    conversationDurationDays,
  };
}
