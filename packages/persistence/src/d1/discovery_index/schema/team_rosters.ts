import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teamsPublic } from "./teams_public.ts";
import { usersPublic } from "./users_public.ts";

// /social-graph-d1/schema/team_rosters
export const teamRosters = sqliteTable('team_rosters', {
  teamId: text('team_id').notNull().references(() => teamsPublic.id),
  userId: text('user_id').notNull().references(() => usersPublic.id),
  role: text('role').notNull().default('member'), // e.g., 'admin', 'coach', 'member'
}, (rosters) => [
  primaryKey({ columns: [rosters.teamId, rosters.userId] }),
  index('user_roster_idx').on(rosters.userId), // CRITICAL for "What teams am I on?"
]);

export type TeamRoster = typeof teamRosters.$inferSelect;
export type NewTeamRoster = typeof teamRosters.$inferInsert;
