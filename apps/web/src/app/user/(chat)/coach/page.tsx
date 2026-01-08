'use client';

import { useState, useCallback } from 'react';
import { coach } from '@bene/react-api-client';
import { useChatUI } from '@/lib/hooks/use-chat-ui';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { ChatView, SavedChatsView, RightActionPanel } from './_components';
import CheckInModal from './_components/check-in-modal';
import { ROUTES } from '@/lib/constants';
import type { MessageData } from './_components/types';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

interface ApiAction {
  type: string;
  details: string;
}

interface ApiMessage {
  id: string;
  content: string;
  sender: string; // 'user' | 'coach'
  sentAt?: string;
  createdAt?: string;
  actions?: ApiAction[] | null;
}

interface CoachPageContentProps {
  historyData: NonNullable<coach.GetCoachHistoryResponse>;
}

function CoachPageContent({ historyData }: CoachPageContentProps) {
  const { leftOpen, rightOpen, toggleLeft, toggleRight } = useChatUI();

  // Mutations
  const sendMessageMutation = coach.useSendMessage();
  const generateSummaryMutation = coach.useGenerateWeeklySummary();
  const respondToCheckInMutation = coach.useRespondToCheckIn();

  // Helper to map API messages to UI messages
  // We use this for initialization to avoid useEffect synchronization
  const getInitialMessages = (): MessageData[] => {
    if (!historyData.messages) return [];
    // We cast to unknown first if the inferred type is incomaptible, but ideally we match the shape
    // Assuming historyData.messages matches ApiMessage[] roughly
    const rawMessages = historyData.messages as unknown as ApiMessage[];

    return rawMessages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      role: msg.sender === 'user' ? 'user' : 'assistant',
      timestamp: new Date(msg.sentAt || msg.createdAt || new Date().toISOString()),
    }));
  };

  const getInitialRecommendations = (): Recommendation[] => {
    if (!historyData.messages) return [];
    const newRecs: Recommendation[] = [];
    const rawMessages = historyData.messages as unknown as ApiMessage[];

    for (const msg of rawMessages) {
      if (msg.actions && Array.isArray(msg.actions)) {
        for (const [idx, action] of msg.actions.entries()) {
          newRecs.push({
            id: `${msg.id}-${idx}`,
            title: action.type
              .split('_')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
            description: action.details,
            category: 'Wellness',
            createdAt: new Date(
              msg.sentAt || msg.createdAt || new Date().toISOString(),
            ).toISOString(),
          });
        }
      }
    }
    return newRecs;
  };

  // Local state initialized from props
  const [messages, setMessages] = useState<MessageData[]>(getInitialMessages);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    getInitialRecommendations,
  );
  const [savedChats] = useState<{ id: string; title: string }[]>([]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: MessageData = {
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

        const assistantMessage: MessageData = {
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

  const handleRespondToCheckIn = async (checkInId: string, response: string) => {
    try {
      await respondToCheckInMutation.mutateAsync({
        json: { checkInId, response },
      });
      // The hook invalidates history, which updates historyData in the parent,
      // which will cause this component to re-render.
      // Ideally, we might want to update local state or let the key change remount it if strictly synced,
      // but typically chat history appends. If we re-mount, we lose scroll position.
      // Since we initialized state, we might diverge from server.
      // For chat, appending is usually fine.
    } catch (err) {
      console.error('Failed to respond to check-in', err);
    }
  };

  const pendingCheckIn = historyData.pendingCheckIns?.[0];

  const handleGenerateSummary = async () => {
    try {
      await generateSummaryMutation.mutateAsync({ json: {} });
    } catch (err) {
      console.error('Failed to generate summary', err);
    }
  };

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
        onGenerateSummary={handleGenerateSummary}
        isGeneratingSummary={generateSummaryMutation.isPending}
      />
      {pendingCheckIn && (
        <CheckInModal
          checkIn={pendingCheckIn}
          isOpen={!!pendingCheckIn}
          onRespond={handleRespondToCheckIn}
          onDismiss={(id) => console.log('Dismiss', id)}
          isLoading={respondToCheckInMutation.isPending}
        />
      )}
    </div>
  );
}

export default function CoachPage() {
  const historyQuery = coach.useCoachHistory();

  if (historyQuery.isLoading) {
    return <LoadingSpinner variant="screen" />;
  }

  if (historyQuery.error) {
    return (
      <ErrorPage
        title="Coach Error"
        message="Unable to load coach functionality."
        error={historyQuery.error}
        backHref={ROUTES.HOME}
      />
    );
  }

  const historyData = historyQuery.data;

  // Render content only when data is ready.
  // We use key to force remount if history strictly changes and we want to reset?
  // No, chat usually persists. Using basic composition is fine.
  // The initial state pattern works for first load.
  if (!historyData) return null;

  return <CoachPageContent historyData={historyData} />;
}
