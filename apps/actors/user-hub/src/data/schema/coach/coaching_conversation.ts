import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

import { CoachContext } from '@bene/coach-domain';
import { coachingMessages } from './coaching_messages';
import { checkIns } from './check_ins';

export const coachingConversation = sqliteTable('coaching_conversation', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),

  // Context snapshot
  contextJson: text('context_json', { mode: 'json' }).notNull().$type<CoachContext>(),

  // Message counters
  totalMessages: integer('total_messages').default(0).notNull(),
  totalUserMessages: integer('total_user_messages').default(0).notNull(),
  totalCoachMessages: integer('total_coach_messages').default(0).notNull(),

  // Check-in counters
  totalCheckIns: integer('total_check_ins').default(0).notNull(),
  pendingCheckIns: integer('pending_check_ins').default(0).notNull(),

  // Timestamps
  startedAt: integer('started_at', { mode: 'timestamp_ms' })
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),
  lastMessageAt: integer('last_message_at', { mode: 'timestamp_ms' })
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),
  lastContextUpdateAt: integer('last_context_update_at', { mode: 'timestamp_ms' }).notNull(),
});

export const coachingConversationRelations = relations(coachingConversation, ({ many }) => ({
  messages: many(coachingMessages),
  checkIns: many(checkIns),
}));

export type CoachConversation = typeof coachingConversation.$inferSelect;
export type NewCoachConversation = typeof coachingConversation.$inferInsert;
