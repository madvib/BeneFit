import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const activityFeed = sqliteTable(
  'activity_feed',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    activityType: text('activity_type', { enum: ['workout_completed', 'pr_achieved', 'streak_milestone', 'plan_completed', 'team_joined'] }),
    contentJson: text('content_json', { mode: 'json' }), // json
    visibility: text('visibility', { enum: ['public', 'team', 'private'] }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    userIdCreatedAtIdx: index('activity_feed_user_id_created_at_idx').on(table.userId, table.createdAt),
    createdAtIdx: index('activity_feed_created_at_idx').on(table.createdAt),
  })
);

export type ActivityFeedItem = typeof activityFeed.$inferSelect;
export type NewActivityFeedItem = typeof activityFeed.$inferInsert;
