import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { participants } from './participants.ts';

export const sessionChat = sqliteTable('session_chat', {
  id: text('id').primaryKey(),
  participantId: text('participant_id')
    .references(() => participants.id)
    .notNull(),
  message: text('message').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).default(sql`(unixepoch())`),
});

export const sessionChatRelations = relations(sessionChat, ({ one }) => ({
  participant: one(participants, {
    fields: [sessionChat.participantId],
    references: [participants.id],
  }),
}));

export type SessionChat = typeof sessionChat.$inferSelect;
export type NewSessionChat = typeof sessionChat.$inferInsert;
