export interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
