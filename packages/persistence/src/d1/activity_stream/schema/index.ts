import { activityFeed } from './activity_feed.js';
import { activityReactions } from './activity_reactions.js';

export * from './activity_feed.js';
export * from './activity_reactions.js';

export const activity_stream_schema = {
  activityFeed,
  activityReactions,
};
