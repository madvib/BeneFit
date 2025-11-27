import { CoachAction } from '../coach-action/coach-action.js';

type MessageRole = 'user' | 'coach' | 'system';

interface CoachingMessageData {
  id: string;
  role: MessageRole;
  content: string;
  actions?: CoachAction[];
  checkInId?: string;
  timestamp: Date;
  tokens?: number;
}

export type CoachingMessage = Readonly<CoachingMessageData>;
