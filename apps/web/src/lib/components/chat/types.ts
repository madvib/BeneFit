import { LucideIcon } from 'lucide-react';

export interface MessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  avatarIcon?: LucideIcon;
  senderName?: string;
  className?: string;
}
