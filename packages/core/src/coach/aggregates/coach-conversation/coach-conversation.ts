// Export all parts of the Coach Conversation aggregate
export type {
  CoachingConversationData,
  CoachingConversation
} from './coach-conversation.types.js';

export {
  createCoachingConversation,
  type CreateCoachingConversationParams
} from './coach-conversation.factory.js';

export * from './coach-conversation.commands.js';
export * from './coach-conversation.queries.js';