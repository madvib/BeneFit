import { z } from 'zod';
import { SessionFeedItem } from './session-feed-item.types.js';

export const FeedItemTypeSchema = z.enum([
  'user_joined',
  'user_left',
  'activity_completed',
  'set_completed',
  'milestone_achieved',
  'encouragement',
  'chat_message'
]);

export const SessionFeedItemSchema = z.object({
  id: z.string(),
  type: FeedItemTypeSchema,
  userId: z.string(),
  userName: z.string().min(1).max(100),
  content: z.string().min(1).max(500),
  timestamp: z.iso.datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SessionFeedItemPresentation = z.infer<typeof SessionFeedItemSchema>;

export function toSessionFeedItemSchema(item: SessionFeedItem): SessionFeedItemPresentation {
  return {
    id: item.id,
    type: item.type,
    userId: item.userId,
    userName: item.userName,
    content: item.content,
    timestamp: item.timestamp.toISOString(),
    metadata: item.metadata,
  };
}
