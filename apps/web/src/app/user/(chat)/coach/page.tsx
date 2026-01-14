'use client';

import { ChatInput, ChatLayout, ChatList, ChatMessage, ErrorPage, LoadingSpinner, type  MessageData } from '@/lib/components';
import { useState, useCallback } from 'react';
import { coach } from '@bene/react-api-client';
import { useChatUI } from '@/lib/hooks/use-chat-ui';
import { SavedChatsView, RightActionPanel, CoachEmptyState } from './_components';
import CheckInModal from './_components/check-in-modal';
import { ROUTES } from '@/lib/constants';

//TODO try to use types from domain instead of below interfaces, reusable hook for message state etc?
interface Recommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  type: string;
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

export function CoachPageContent({ historyData }: CoachPageContentProps) {
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
            reason: action.details,
            type: action.type,
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
  const [savedChats] = useState<{ id: string; title: string }[]>([
    { id: 'c-1', title: 'Marathon Training Plan' },
    { id: 'c-2', title: 'Nutrition Advice' },
    { id: 'c-3', title: 'Recovery from Injury' },
    { id: 'c-4', title: 'Strength Routine' },
  ]);
  const [dismissedCheckIns, setDismissedCheckIns] = useState<string[]>([]);

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
      // Dismiss after responding so it closes
      setDismissedCheckIns((prev) => [...prev, checkInId]);
    } catch (err) {
      console.error('Failed to respond to check-in', err);
    }
  };
  
  const handleDismissCheckIn = (id: string) => {
    setDismissedCheckIns((prev) => [...prev, id]);
  };

  const pendingCheckIn = historyData.pendingCheckIns?.find(c => !dismissedCheckIns.includes(c.id));

  const handleGenerateSummary = async () => {
    try {
      await generateSummaryMutation.mutateAsync({ json: {} });
    } catch (err) {
      console.error('Failed to generate summary', err);
    }
  };

  return (
    <div className="relative flex flex-1 overflow-hidden h-full chat-container">
      <ChatLayout
         sidebar={
            <SavedChatsView
              isOpen={leftOpen}
              onClose={toggleLeft}
              chats={savedChats}
              onNewChat={handleNewChat}
            />
         }
         rightPanel={
             <RightActionPanel
              isOpen={rightOpen}
              onClose={toggleRight}
              recommendations={recommendations}
              onGenerateSummary={handleGenerateSummary}
              isGeneratingSummary={generateSummaryMutation.isPending}
            />
         }
      >
        {/* Main Chat Area */}
          <div className="bg-background relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
             {/* Background patterns */}
              <div
                className="bg-primary/5 pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, rgba(var(--primary), 0.1) 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }}
              />

              <ChatList 
                emptyState={<CoachEmptyState onSuggestionClick={sendMessage} />}
                typingIndicator={false} // TODO: Implement isTyping state
              >
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} {...msg} />
                ))}
              </ChatList>

              <div className="from-background via-background z-10 shrink-0 bg-linear-to-t to-transparent p-6 pt-0">
                  <ChatInput onSend={sendMessage} />
              </div>
          </div>
      </ChatLayout>
      
      {pendingCheckIn && (
        <CheckInModal
          checkIn={pendingCheckIn}
          isOpen={!!pendingCheckIn}
          onRespond={handleRespondToCheckIn}
          onDismiss={handleDismissCheckIn}
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

  if (!historyData) return null;

  return <CoachPageContent historyData={historyData} />;
}
