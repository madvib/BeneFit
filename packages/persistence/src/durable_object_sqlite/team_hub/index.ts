import { chatMessages } from './schema/chat_messages.ts';
import { team } from './schema/team.ts';
import { teamChallenges } from './schema/team_challenges.ts';
import { teamMembers } from './schema/team_members.ts';

export * from './schema/team_challenges.ts';
export * from './schema/team_members.ts';
export * from './schema/chat_messages.ts';
export * from './schema/team.ts';


export const team_do_schema = {
  teamChallenges,
  teamMembers,
  team,
  chatMessages
};