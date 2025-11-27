import { CheckIn } from '../../value-objects/check-in/check-in.js';
import { CoachingContext } from '../../value-objects/coaching-context/coaching-context.js';
import { CoachingMessage } from '../../value-objects/coaching-message/coaching-message.js';

export interface CoachingConversationData {
  id: string;
  userId: string;
  context: CoachingContext;
  messages: CoachingMessage[];
  checkIns: CheckIn[];
  totalMessages: number;
  totalUserMessages: number;
  totalCoachMessages: number;
  totalCheckIns: number;
  pendingCheckIns: number;
  startedAt: Date;
  lastMessageAt: Date;
  lastContextUpdateAt: Date;
}

export type CoachingConversation = Readonly<CoachingConversationData>;