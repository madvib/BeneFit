'use client';

import { useState, useCallback } from 'react';
import { coach } from '@bene/react-api-client';
import { useChatUI } from '@/lib/hooks/use-chat-ui';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { ChatView, SavedChatsView, RightActionPanel } from './#components';
import { ROUTES } from '@/lib/constants';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export default function CoachPage() {
  const { leftOpen, rightOpen, toggleLeft, toggleRight } = useChatUI();

  // Mutations
  const sendMessageMutation = coach.useSendMessage();
  const generateSummaryMutation = coach.useGenerateWeeklySummary();

  // Local state
  const [messages, setMessages] = useState<Message[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [savedChats] = useState<any[]>([]); // TODO: Fetch from API when available

  const isLoading = sendMessageMutation.isPending || generateSummaryMutation.isPending;
  const error = sendMessageMutation.error || generateSummaryMutation.error;

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await sendMessageMutation.mutateAsync({
          json: { message: content },
        });

        const assistantMessage: Message = {
          id: response?.conversationId || crypto.randomUUID(),
          content: response.coachResponse || '',
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        throw error;
      }
    },
    [sendMessageMutation],
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setRecommendations([]);
  }, []);

  if (isLoading) {
    return <LoadingSpinner variant="screen" />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Coach Error"
        message="Unable to load coach functionality."
        error={error}
        backHref={ROUTES.HOME}
      />
    );
  }

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <SavedChatsView
        isOpen={leftOpen}
        onClose={toggleLeft}
        chats={savedChats}
        onNewChat={handleNewChat}
      />
      <ChatView messages={messages} onSendMessage={sendMessage} />
      <RightActionPanel
        isOpen={rightOpen}
        onClose={toggleRight}
        recommendations={recommendations}
      />
    </div>
  );
}
