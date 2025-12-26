'use client';

import { useState, useCallback } from 'react';
import { coach } from '@bene/react-api-client';


// Define Message type based on API response
type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface UseCoachControllerResult {
  savedChats: any[]; // TODO: Add when GET /coach/history endpoint exists
  messages: Message[];
  recommendations: any[]; // TODO: Type when summary endpoint returns structured data
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  fetchCoachData: () => Promise<void>;
  handleNewChat: () => void;
}

export function useCoachController(): UseCoachControllerResult {
  // React Query hooks from api-client
  const sendMessageMutation = coach.useSendMessage();
  const generateSummaryMutation = coach.useGenerateWeeklySummary();
  const dismissCheckInMutation = coach.useDismissCheckIn();
  const respondToCheckInMutation = coach.useRespondToCheckIn();
  const triggerCheckInMutation = coach.useTriggerProactiveCheckIn();

  // Local UI state for current conversation
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [currentRecommendations, setCurrentRecommendations] = useState<any[]>([]);

  // Controller methods
  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        timestamp: new Date(),
      };

      // Optimistic update
      setCurrentMessages((prev) => [...prev, userMessage]);

      try {
        const response = await sendMessageMutation.mutateAsync({
          json: { message: content },
        });

        // Add assistant response to messages
        const assistantMessage: Message = {
          id: response?.id || crypto.randomUUID(),
          content: response.message || '',
          role: 'assistant',
          timestamp: new Date(response.timestamp || Date.now()),
        };

        setCurrentMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        // Rollback on error
        setCurrentMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        throw error;
      }
    },
    [sendMessageMutation],
  );

  const fetchCoachData = useCallback(async () => {
    // TODO: Fetch chat history when endpoint is available
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentMessages([]);
    setCurrentRecommendations([]);
  }, []);

  // Consolidated loading state
  const isLoading =
    sendMessageMutation.isPending ||
    generateSummaryMutation.isPending ||
    dismissCheckInMutation.isPending ||
    respondToCheckInMutation.isPending ||
    triggerCheckInMutation.isPending;

  // Consolidated error
  const error =
    sendMessageMutation.error ||
    generateSummaryMutation.error ||
    dismissCheckInMutation.error ||
    respondToCheckInMutation.error ||
    triggerCheckInMutation.error;

  return {
    savedChats: [], // TODO: Populate when GET /coach/history endpoint is available
    messages: currentMessages,
    recommendations: currentRecommendations,
    isLoading,
    error: error as Error | null,
    sendMessage,
    fetchCoachData,
    handleNewChat,
  };
}
