import { z } from 'zod';

// Session Feed Item Schemas

export const FeedItemTypeSchema = z.enum([
  'user_joined',
  'user_left',
  'activity_completed',
  'set_completed',
  'milestone_achieved',
  'encouragement',
  'chat_message',
]);

export const SessionFeedItemSchema = z.object({
  id: z.string(),
  type: FeedItemTypeSchema,
  userId: z.string(),
  userName: z.string(),
  content: z.string(),
  timestamp: z.string(), // ISO date string
  metadata: z.record(z.string(), z.unknown()).optional(), // Extra context (e.g., weight lifted, reps done)
});

// Export inferred types
export type FeedItemType = z.infer<typeof FeedItemTypeSchema>;
export type SessionFeedItem = z.infer<typeof SessionFeedItemSchema>;
