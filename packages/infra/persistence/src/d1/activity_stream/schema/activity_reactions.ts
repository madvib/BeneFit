import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { activityFeed } from './activity_feed.ts';

export const activityReactions = sqliteTable(
  'activity_reactions',
  {
    id: text('id').primaryKey(),
    feedItemId: text('feed_item_id').references(() => activityFeed.id),
    userId: text('user_id').notNull(),
    emoji: text('emoji').notNull(),
    createdAt: integer('created_at', { mode: 'number' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('activity_reactions_feed_item_id_idx').on(table.feedItemId),
    index('activity_reactions_user_id_idx').on(table.userId),
  ],
);

export const activityReactionsRelations = relations(activityReactions, ({ one }) => ({
  feedItem: one(activityFeed, {
    fields: [activityReactions.feedItemId],
    references: [activityFeed.id],
  }),
}));

export type ActivityReaction = typeof activityReactions.$inferSelect;
export type NewActivityReaction = typeof activityReactions.$inferInsert;
