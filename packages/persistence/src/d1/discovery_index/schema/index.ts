import { usersPublic } from './users_public.js';
import { teamsPublic } from './teams_public.js';
import { teamRosters } from './team_rosters.js';
import { activeWorkoutSessions } from './active_workout_sessions.js';

export * from './users_public.js';
export * from './teams_public.js';
export * from './team_rosters.js';
export * from './active_workout_sessions.js';

export const discovery_index_schema = {
  usersPublic,
  teamsPublic,
  teamRosters,
  activeWorkoutSessions,
};
