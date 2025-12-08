import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const coachingConversation = sqliteTable('coaching_conversation', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),

  // Context snapshot
  contextJson: text('context_json', { mode: 'json' }), // CoachContext

  // Message counters
  totalMessages: integer('total_messages').default(0),
  totalUserMessages: integer('total_user_messages').default(0),
  totalCoachMessages: integer('total_coach_messages').default(0),

  // Check-in counters
  totalCheckIns: integer('total_check_ins').default(0),
  pendingCheckIns: integer('pending_check_ins').default(0),

  // Timestamps
  startedAt: integer('started_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  lastMessageAt: integer('last_message_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  lastContextUpdateAt: integer('last_context_update_at', { mode: 'timestamp' }),

  // Note: Messages are in separate coaching_messages table
  // Note: Check-ins are in separate check_ins table
});

export type CoachConversation = typeof coachingConversation.$inferSelect;
export type NewCoachConversation = typeof coachingConversation.$inferInsert;
