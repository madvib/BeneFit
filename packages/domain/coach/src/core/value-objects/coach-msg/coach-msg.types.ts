import { CoachAction } from '../coach-action/index.js';

type MessageRole = 'user' | 'coach' | 'system';

interface CoachMsgData {
  id: string;
  role: MessageRole;
  content: string;
  actions?: CoachAction[];
  checkInId?: string;
  timestamp: Date;
  tokens?: number;
}

export type CoachMsg = Readonly<CoachMsgData>;
