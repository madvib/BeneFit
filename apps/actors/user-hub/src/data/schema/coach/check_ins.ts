import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { CoachAction } from '@bene/coach-domain';
import { coachingConversation } from './coaching_conversation';

export const checkIns = sqliteTable(
  'check_ins',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id').notNull(),

    // Check-in type and trigger
    type: text('type').notNull(), // 'proactive' | 'scheduled' | 'user_initiated'
    triggeredBy: text('triggered_by'), // 'low_adherence' | 'high_exertion' | 'injury_reported' | etc.

    // Question and response
    question: text('question').notNull(),
    userResponse: text('user_response'),

    // Coach analysis and actions
    coachAnalysis: text('coach_analysis'),
    actionsJson: text('actions_json', { mode: 'json' }).$type<CoachAction[]>(), // CoachAction[]

    // Status
    status: text('status').notNull(), // 'pending' | 'responded' | 'dismissed'

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(
      sql`(unixepoch() * 1000)`
    ),
    respondedAt: integer('responded_at', { mode: 'timestamp_ms' }),
    dismissedAt: integer('dismissed_at', { mode: 'timestamp_ms' }),
  },
  (table) => [
    index('check_ins_conversation_id_idx').on(table.conversationId),
    index('check_ins_status_idx').on(table.status),
    index('check_ins_conversation_status_idx').on(table.conversationId, table.status),
  ]
);

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  conversation: one(coachingConversation, {
    fields: [checkIns.conversationId],
    references: [coachingConversation.id],
  }),
}));

export type CheckIn = typeof checkIns.$inferSelect;
export type NewCheckIn = typeof checkIns.$inferInsert;
