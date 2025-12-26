import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { coachingConversation } from './coaching_conversation.js';

export const coachingMessages = sqliteTable(
  'coaching_messages',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .references(() => coachingConversation.id)
      .notNull(),
    role: text('role', { enum: ['user', 'assistant'] }).notNull(),
    content: text('content').notNull(),
    contextJson: text('context_json', { mode: 'json' }), // nullable - relevant workout data
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('coaching_messages_conversation_id_created_at_idx').on(
      table.conversationId,
      table.createdAt,
    ),
  ],
);

export const coachingMessagesRelations = relations(coachingMessages, ({ one }) => ({
  conversation: one(coachingConversation, {
    fields: [coachingMessages.conversationId],
    references: [coachingConversation.id],
  }),
}));

export type CoachMsg = typeof coachingMessages.$inferSelect;
export type NewCoachMsg = typeof coachingMessages.$inferInsert;
