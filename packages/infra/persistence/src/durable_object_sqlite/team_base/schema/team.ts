import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';


export const team = sqliteTable('team', {
  // We don't use the id column as the DO's ID is implicit, but we include it for schema conformity.
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  // Denormalized counter cache of the current chat message ID/count for history tracking
  latestChatMessageId: integer('latest_chat_message_id').default(0),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }).default(
    sql`(unixepoch())`),
});

export type Team = typeof team.$inferSelect;
export type NewTeam = typeof team.$inferInsert
