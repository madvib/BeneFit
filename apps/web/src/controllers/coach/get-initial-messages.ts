'use server';

import { getInitialMessagesUseCase } from '@/providers/coach-use-cases';

// Define the return types for transformed data
interface MessageData {
  id: number | string;
  content: string;
  role: 'user' | 'coach';
  timestamp: string;
}

interface GetInitialMessagesResult {
  success: boolean;
  data: MessageData[];
  error?: string;
}

export async function getInitialMessages(
  chatId: string,
): Promise<GetInitialMessagesResult> {
  try {
    const result = await getInitialMessagesUseCase.execute({ chatId });

    if (result.isSuccess) {
      // Transform the Message entities to plain objects for client consumption
      const transformedData = result.value.map((message) => ({
        id: message.id,
        content: message.content,
        role: message.sender,
        timestamp: message.timestamp,
      }));

      return {
        success: true,
        data: transformedData,
      };
    } else {
      console.error('Failed to fetch initial messages:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch initial messages',
      };
    }
  } catch (error) {
    console.error('Error in getInitialMessages controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
