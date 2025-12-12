import { activityFeed } from './activity_feed';
import { activityReactions } from './activity_reactions';

export * from './activity_feed';
export * from './activity_reactions';

export const activity_stream_schema = {
  ...activityFeed,
 ...activityReactions
}