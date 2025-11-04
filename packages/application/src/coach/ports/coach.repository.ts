import { Repository } from '@bene/core/shared';
import { Chat } from '@bene/core/coach';
import { Message } from '@bene/core/coach';

export interface CoachRepository extends Repository<Chat> {
  getSavedChats(): Promise<Chat[]>;
  getInitialMessages(chatId: string): Promise<Message[]>;
  sendMessage(message: Message): Promise<Message>;
}
