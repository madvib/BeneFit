import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { activityReactions } from './activity_reactions.ts';

export const activityFeed = sqliteTable(
  'activity_feed',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull(), // The user who SEES this item (The Inbox)
    creatorId: text('creator_id').notNull(), // The user who CREATED the workout/post
    teamId: text('team_id'), // Nullable. Used for team-specific feeds.
    activityType: text('activity_type', { enum: ['workout_completed', 'pr_achieved', 'streak_milestone', 'plan_completed', 'team_joined'] }),
    contentJson: text('content_json', { mode: 'json' }), // json
    visibility: text('visibility', { enum: ['public', 'team', 'private'] }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('activity_feed_owner_id_created_at_idx').on(table.ownerId, table.createdAt),
    index('team_feed_time_idx').on(table.teamId, table.createdAt),
    index('activity_feed_created_at_idx').on(table.createdAt),
  ]
);
// Add the relation definition here
export const activityFeedRelations = relations(activityFeed, ({ many }) => ({
  reactions: many(activityReactions), // <-- One activity feed item has MANY reactions
}));

export type ActivityFeedItem = typeof activityFeed.$inferSelect;
export type NewActivityFeedItem = typeof activityFeed.$inferInsert;
