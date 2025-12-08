import { CoachContext, CoachMsg, CheckIn } from '../../value-objects/index.js';

export interface CoachConversationData {
  id: string;
  userId: string;
  context: CoachContext;
  messages: CoachMsg[];
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

export type CoachConversation = Readonly<CoachConversationData>;
