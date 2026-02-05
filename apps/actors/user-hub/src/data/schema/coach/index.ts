import { checkIns, checkInsRelations } from './check_ins';
import { coachingConversation, coachingConversationRelations } from './coaching_conversation';
import { coachingMessages, coachingMessagesRelations } from './coaching_messages';

export * from './check_ins';
export * from './coaching_conversation';
export * from './coaching_messages';

export const coach_schema = {
  checkIns,
  checkInsRelations,
  coachingConversation,
  coachingConversationRelations,
  coachingMessages,
  coachingMessagesRelations,
};
