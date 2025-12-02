import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const participants = sqliteTable(
  'participants',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url'),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    lastHeartbeatAt: integer('last_heartbeat_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    status: text('status', { enum: ['active', 'disconnected'] }).default('active'),
  },
  (table) => ({
    userIdIdx: index('participants_user_id_idx').on(table.userId),
  })
);

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
