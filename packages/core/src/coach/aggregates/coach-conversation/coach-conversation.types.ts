import {
  CoachingContext,
  CoachingMessage,
  CheckIn,
} from '../../value-objects/index.js';

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
