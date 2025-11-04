'use client';

import { useState, useEffect } from 'react';
import {
  getSavedChats,
  getInitialMessages,
  getCoachRecommendations,
  type ChatData,
  type MessageData,
  type RecommendationData,
} from '@/controllers/coach';

interface UseCoachControllerResult {
  savedChats: ChatData[];
  messages: MessageData[];
  recommendations: RecommendationData[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
  fetchCoachData: () => Promise<void>;
  handleNewChat: () => void;
}

export function useCoachController(
  userId: string = 'user-123',
): UseCoachControllerResult {
  const [savedChats, setSavedChats] = useState<ChatData[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoachData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [chatsResult, messagesResult, recommendationsResult] = await Promise.all([
        getSavedChats(),
        getInitialMessages('default'), // Using 'default' chat ID for initial messages
        getCoachRecommendations(userId),
      ]);

      if (chatsResult.success) {
        setSavedChats(chatsResult.data);
      } else {
        setError(chatsResult.error || 'Failed to fetch chats');
      }

      if (messagesResult.success) {
        setMessages(messagesResult.data);
      } else {
        setError(messagesResult.error || 'Failed to fetch messages');
      }

      if (recommendationsResult.success) {
        setRecommendations(recommendationsResult.data);
      } else {
        setError(recommendationsResult.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Failed to load coach data');
      console.error('Error fetching coach data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (content: string) => {
    if (content.trim() === '') return;

    // Add user message
    const userMessage: MessageData = {
      id: Date.now().toString(), // Using timestamp as ID since we're not storing in a real system
      content: content,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: MessageData = {
        id: (Date.now() + 1).toString(),
        content:
          'I understand. Based on your activity data and goals, I recommend focusing on proper form first before increasing intensity. Would you like specific exercises?',
        sender: 'coach',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleNewChat = () => {
    console.log('Creating new chat...');
  };

  useEffect(() => {
    fetchCoachData();
  }, [userId]);

  return {
    savedChats,
    messages,
    recommendations,
    isLoading,
    error,
    sendMessage,
    fetchCoachData,
    handleNewChat,
  };
}
