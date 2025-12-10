import { checkIns } from './check_ins.ts';
import { coachingConversation } from './coaching_conversation.ts';
import { coachingMessages, coachingMessagesRelations } from './coaching_messages.ts';

export * from './check_ins.ts';
export * from './coaching_conversation.ts';
export * from './coaching_messages.ts';

export const coachSchema = {
  checkIns,
  coachingConversation,
  coachingMessages,
  coachingMessagesRelations,
};
