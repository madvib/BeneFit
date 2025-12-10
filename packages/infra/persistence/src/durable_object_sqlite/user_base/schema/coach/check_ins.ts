import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

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
    actionsJson: text('actions_json', { mode: 'json' }), // CoachAction[]
    
    // Status
    status: text('status').notNull(), // 'pending' | 'responded' | 'dismissed'
    
    // Timestamps
    createdAt: integer('created_at', { mode: 'number' }).default(sql`(unixepoch())`),
    respondedAt: integer('responded_at', { mode: 'number' }),
    dismissedAt: integer('dismissed_at', { mode: 'number' }),
  },
  (table) => [
    index('check_ins_conversation_id_idx').on(table.conversationId),
    index('check_ins_status_idx').on(table.status),
    index('check_ins_conversation_status_idx').on(table.conversationId, table.status),
  ]
);

export type CheckIn = typeof checkIns.$inferSelect;
export type NewCheckIn = typeof checkIns.$inferInsert;
