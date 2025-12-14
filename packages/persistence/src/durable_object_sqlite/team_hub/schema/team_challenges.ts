import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { team } from './team.ts';

export const teamChallenges = sqliteTable(
  'team_challenges',
  {
    id: text('id').primaryKey(),
    teamId: text('team_id').references(() => team.id),
    name: text('name').notNull(),
    description: text('description'),
    challengeType: text('challenge_type', {
      enum: ['total_volume', 'total_distance', 'workout_count', 'streak'],
    }),
    startDate: integer('start_date', { mode: 'timestamp' }),
    endDate: integer('end_date', { mode: 'timestamp' }),
    status: text('status', { enum: ['upcoming', 'active', 'completed'] }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => [index('team_challenges_team_id_idx').on(table.teamId)],
);

export const teamChallengesRelations = relations(teamChallenges, ({ one }) => ({
  team: one(team, {
    fields: [teamChallenges.teamId],
    references: [team.id],
  }),
}));

export type TeamChallenge = typeof teamChallenges.$inferSelect;
export type NewTeamChallenge = typeof teamChallenges.$inferInsert;
