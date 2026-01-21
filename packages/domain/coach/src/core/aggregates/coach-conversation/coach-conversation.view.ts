import { CreateView, serializeForView } from '@bene/shared';
import { toCoachContextView, toCoachMsgView, toCheckInView } from '../../value-objects/index.js';
import { CoachConversation } from './coach-conversation.types.js';
import * as Queries from './coach-conversation.queries.js';



/**
 * 3. VIEW TYPES (Serialized with conversation analytics)
 */
export type CoachConversationView = CreateView<
  CoachConversation,
  never,
  {
    conversationSummary: {
      messageCount: number;
      userMessageCount: number;
      coachMessageCount: number;
      checkInCount: number;
      pendingCheckInCount: number;
      daysSinceStart: number;
      daysSinceLastMessage: number;
    };
    totalActionsApplied: number;
    shouldSendCheckIn: boolean;
  }
>;

/**
 * Map CoachConversation aggregate to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Maps nested value objects
 * - Adds computed fields for conversation analytics
 */
export function toCoachConversationView(conversation: CoachConversation): CoachConversationView {
  const base = serializeForView(conversation);

  return {
    ...base,
    context: toCoachContextView(conversation.context),
    messages: conversation.messages.map(toCoachMsgView),
    checkIns: conversation.checkIns.map(toCheckInView),
    conversationSummary: Queries.getConversationSummary(conversation),
    totalActionsApplied: Queries.getTotalActionsApplied(conversation),
    shouldSendCheckIn: Queries.shouldSendCheckIn(conversation),
  };
}
