import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const teams = sqliteTable(
  'teams',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    createdByUserId: text('created_by_user_id').notNull(),
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    inviteCode: text('invite_code').unique(),
    memberCount: integer('member_count').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    createdByUserIdx: index('teams_created_by_user_idx').on(table.createdByUserId),
    inviteCodeIdx: index('teams_invite_code_idx').on(table.inviteCode),
  })
);

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
