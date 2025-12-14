import { usersPublic } from './users_public.ts';
import { teamsPublic } from './teams_public.ts';
import { teamRosters } from './team_rosters.ts';
import { activeWorkoutSessions } from './active_workout_sessions.ts';

export * from './users_public.ts';
export * from './teams_public.ts';
export * from './team_rosters.ts';
export * from './active_workout_sessions.ts';

export const discovery_index_schema = {
  ...usersPublic,
  ...teamsPublic,
  ...teamRosters,
  ...activeWorkoutSessions,
};
