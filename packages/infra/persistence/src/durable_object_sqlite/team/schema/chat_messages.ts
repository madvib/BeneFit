import { sqliteTable, text, integer,  index } from 'drizzle-orm/sqlite-core';
import { teamMembers } from './members.js';
import { sql } from 'drizzle-orm';

export const chatMessages = sqliteTable('chat_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => teamMembers.userId),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  // Index for querying recent messages efficiently
  timeIndex: index('chat_time_idx').on(table.createdAt), 
}));