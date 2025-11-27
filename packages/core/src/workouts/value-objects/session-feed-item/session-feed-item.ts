export type FeedItemType =
  | 'user_joined'
  | 'user_left'
  | 'activity_completed'
  | 'set_completed'
  | 'milestone_achieved'
  | 'encouragement'
  | 'chat_message';

export interface SessionFeedItem {
  id: string;
  type: FeedItemType;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>; // Extra context (e.g., weight lifted, reps done)
}
