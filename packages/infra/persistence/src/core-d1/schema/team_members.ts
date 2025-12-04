import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { teams } from './teams.js';

export const teamMembers = sqliteTable(
  'team_members',
  {
    teamId: text('team_id').references(() => teams.id),
    userId: text('user_id'),
    role: text('role', { enum: ['owner', 'admin', 'member'] }).default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teamId, table.userId] }),
    userIdIdx: index('team_members_user_id_idx').on(table.userId),
  })
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
