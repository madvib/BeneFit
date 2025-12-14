import { activityFeed } from './activity_feed.ts';
import { activityReactions } from './activity_reactions.ts';

export * from './activity_feed.ts';
export * from './activity_reactions.ts';

export const activity_stream_schema = {
  ...activityFeed,
  ...activityReactions
}