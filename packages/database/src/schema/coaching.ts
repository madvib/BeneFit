import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

// Conversation snapshots - full conversation lives in UserAgent DO
export const coachingConversations = sqliteTable('coaching_conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Snapshot data (JSON serialized)
  contextSnapshot: text('context_snapshot', { mode: 'json' }).notNull(), // CoachingContext
  messagesSnapshot: text('messages_snapshot', { mode: 'json' }).notNull(), // Last 50 messages
  checkInsSnapshot: text('check_ins_snapshot', { mode: 'json' }).notNull(), // All check-ins

  // Stats
  totalMessages: integer('total_messages').notNull().default(0),
  totalCheckIns: integer('total_check_ins').notNull().default(0),
  pendingCheckIns: integer('pending_check_ins').notNull().default(0),

  // Metadata
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  lastMessageAt: integer('last_message_at', { mode: 'timestamp' }).notNull(),
  lastSnapshotAt: integer('last_snapshot_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('coaching_conversations_user_id_idx').on(table.userId),
}));

export const coachingConversationsRelations = relations(coachingConversations, ({ one }) => ({
  user: one(users, {
    fields: [coachingConversations.userId],
    references: [users.id],
  }),
}));

// Type exports
export type CoachingConversation = typeof coachingConversations.$inferSelect;
export type NewCoachingConversation = typeof coachingConversations.$inferInsert;