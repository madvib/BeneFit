import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const coachingConversation = sqliteTable(
  'coaching_conversation',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(), // CRITICAL: Added from domain
    startedAt: integer('started_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    lastMessageAt: integer('last_message_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    messageCount: integer('message_count').default(0),
    
    // LEGACY FIELDS (from coaching.ts) - Consider adding if needed:
    // contextSnapshot: text('context_snapshot', { mode: 'json' }) - CoachingContext snapshot
    // messagesSnapshot: text('messages_snapshot', { mode: 'json' }) - Last 50 messages snapshot
    // checkInsSnapshot: text('check_ins_snapshot', { mode: 'json' }) - All check-ins snapshot
    // totalCheckIns: integer('total_check_ins').default(0)
    // pendingCheckIns: integer('pending_check_ins').default(0)
    // lastSnapshotAt: integer('last_snapshot_at', { mode: 'timestamp' })
  }
);

export type CoachingConversation = typeof coachingConversation.$inferSelect;
export type NewCoachingConversation = typeof coachingConversation.$inferInsert;
