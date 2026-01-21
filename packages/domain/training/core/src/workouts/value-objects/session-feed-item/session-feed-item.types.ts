import { z } from 'zod';
import type { CreateView } from '@bene/shared';

export const FeedItemTypeSchema = z.enum([
  'user_joined',
  'user_left',
  'activity_completed',
  'set_completed',
  'milestone_achieved',
  'encouragement',
  'chat_message',
]);
export type FeedItemType = z.infer<typeof FeedItemTypeSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const SessionFeedItemSchema = z.object({
  id: z.uuid(),
  type: FeedItemTypeSchema,
  userId: z.uuid(),
  userName: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  timestamp: z.coerce.date<Date>(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * 2. INFER TYPES
 */
export type SessionFeedItem = Readonly<z.infer<typeof SessionFeedItemSchema>>;

/**
 * 3. VIEW TYPES
 */
export type SessionFeedItemView = CreateView<SessionFeedItem>;
