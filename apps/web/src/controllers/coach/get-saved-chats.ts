'use server';

import { getSavedChatsUseCase } from '@/providers/coach-use-cases';

// Define the return types for transformed data
export interface ChatData {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface GetSavedChatsResult {
  success: boolean;
  data: ChatData[];
  error?: string;
}

export async function getSavedChats(): Promise<GetSavedChatsResult> {
  try {
    const result = await getSavedChatsUseCase.execute();

    if (result.isSuccess) {
      // Transform the Chat entities to plain objects for client consumption
      const transformedData = result.value.map((chat) => ({
        id: chat.id,
        title: chat.title,
        lastMessage: chat.lastMessage,
        timestamp: chat.timestamp,
        unread: chat.unread,
      }));

      return {
        success: true,
        data: transformedData,
      };
    } else {
      console.error('Failed to fetch saved chats:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch saved chats',
      };
    }
  } catch (error) {
    console.error('Error in getSavedChats controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
