import { usersPublic } from './users_public';
import { teamsPublic } from './teams_public';
import { teamRosters } from './team_rosters';
import { activeWorkoutSessions } from './active_workout_sessions';

export * from './users_public';
export * from './teams_public';
export * from './team_rosters';
export * from './active_workout_sessions';

export const discovery_index_schema = {
  ...usersPublic,
  ...teamsPublic,
  ...teamRosters,
  ...activeWorkoutSessions,
};
