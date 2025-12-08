// Export all parts of the Coach Conversation aggregate
export type { CoachConversation } from './coach-conversation.types.js';

export { createCoachConversation } from './coach-conversation.factory.js';

export * as CoachConversationCommands from './coach-conversation.commands.js';
export * as CoachConversationQueries from './coach-conversation.queries.js';
