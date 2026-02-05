import { chatMessages } from './schema/chat_messages.js';
import { team } from './schema/team.js';
import { teamChallenges } from './schema/team_challenges.js';
import { teamMembers } from './schema/team_members.js';

export * from './schema/team_challenges.js';
export * from './schema/team_members.js';
export * from './schema/chat_messages.js';
export * from './schema/team.js';

export const team_do_schema = {
  teamChallenges,
  teamMembers,
  team,
  chatMessages,
};
