import { CoachRepository } from '@bene/application/coach';
import { Chat, Message } from '@bene/core/coach';
import { Result } from '@bene/core/shared';

// Define interfaces for JSON data import
interface ChatData {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface MessageData {
  id: number;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

export class MockCoachRepository implements CoachRepository {
  async findById(id: string): Promise<Result<Chat>> {
    const chats = await this.getSavedChats();
    const chat = chats.find((c) => c.id === id);

    if (!chat) {
      return Result.fail(new Error('Chat not found'));
    }

    return Result.ok(chat);
  }

  async save(entity: Chat): Promise<Result<void>> {
    console.log(`${entity} saved`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    console.log(`${id} deleted`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  private async loadChatData(): Promise<ChatData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/savedChats.json');
    return data.default as ChatData[];
  }

  private async loadMessageData(): Promise<MessageData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/messages.json');
    return data.default as MessageData[];
  }

  async getSavedChats(): Promise<Chat[]> {
    const chatData = await this.loadChatData();
    const chats: Chat[] = [];

    for (const data of chatData) {
      const entityResult = Chat.create({
        id: data.id.toString(),
        title: data.title,
        lastMessage: data.lastMessage,
        timestamp: data.timestamp,
        unread: data.unread,
        isActive: true,
      });

      if (entityResult.isSuccess) {
        chats.push(entityResult.value);
      } else {
        console.error('Failed to create Chat entity:', entityResult.error);
      }
    }

    return chats;
  }

  async getInitialMessages(_chatId: string): Promise<Message[]> {
    const messageData = await this.loadMessageData();
    const messages: Message[] = [];

    for (const data of messageData) {
      const entityResult = Message.create({
        id: data.id.toString(),
        content: data.content,
        sender: data.sender,
        timestamp: data.timestamp,
        isActive: true,
      });

      if (entityResult.isSuccess) {
        messages.push(entityResult.value);
      } else {
        console.error('Failed to create Message entity:', entityResult.error);
      }
    }

    return messages;
  }

  async sendMessage(message: Message): Promise<Message> {
    // In a mock implementation, just return the message as if it was sent
    // We could also add it to the messages array if needed for persistence
    return message;
  }
}
