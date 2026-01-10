import type { Meta, StoryObj } from '@storybook/react';
import ChatView from './chat-view';
import { MessageData } from './types';
import ChatMessage from './chat-message';
import { mockRecommendations, mockCoachHistory } from '@/lib/testing/fixtures';
import { ChatUIProvider } from '@/lib/hooks/use-chat-ui';
import { SavedChatsView, RightActionPanel } from './index';
import ChatHeader from '../../_components/chat-header';
import CheckInModal from './check-in-modal';

const meta: Meta<typeof ChatView> = {
  title: 'Features/Coach',
  component: ChatView,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSendMessage: (content: string) => console.log('Message sent:', content),
    isTyping: false,
  },
};

export default meta;
type Story = StoryObj<typeof ChatView>;

// --- Mock Data ---

const MOCK_MESSAGES: MessageData[] = mockCoachHistory.messages.map((msg) => ({
  id: msg.id,
  role: msg.role === 'coach' ? 'assistant' : (msg.role as 'user' | 'assistant'),
  content: msg.content,
  timestamp: new Date(msg.timestamp),
}));

const USER_MESSAGE: MessageData = {
  id: '1',
  role: 'user',
  content: 'Hi coach, I feel a bit tired today. Should I skip my workout?',
  timestamp: new Date(),
};

const ASSISTANT_MESSAGE: MessageData = {
  id: '2',
  role: 'assistant',
  content:
    "It depends on how tired you are. If it's just general fatigue, a light recovery session might actually help!",
  timestamp: new Date(),
};

const CHECK_IN_DATA = {
  id: 'checkin-1',
  question: 'How are you feeling about your progress this week?',
};

// --- Stories ---

export const FullLayout: Story = {
  name: 'Full Coach Interface',
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <ChatUIProvider>
      <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden">
        <ChatHeader title="AI Coach" />
        <div className="relative flex flex-1 overflow-hidden">
          <SavedChatsView
            isOpen={true}
            onClose={() => {}}
            chats={[
              { id: '1', title: 'Marathon Prep' },
              { id: '2', title: 'Leg Day Recovery' },
            ]}
            onNewChat={() => {}}
          />
          <ChatView {...args} />
          <RightActionPanel
            isOpen={false}
            onClose={() => {}}
            recommendations={[]}
            onGenerateSummary={() => {}}
            isGeneratingSummary={false}
          />
        </div>
      </div>
    </ChatUIProvider>
  ),
  args: {
    messages: [
      ...MOCK_MESSAGES,
      {
        id: '5',
        role: 'user',
        content: 'Can you give me a summary of my progress?',
        timestamp: new Date(),
      },
      {
        id: '6',
        role: 'assistant',
        content:
          "Sure! Over the last 4 weeks, you've increased your total volume by 15% and maintained a consistent 3-day streak. Your estimated 1RM for squat has increased by 10lbs. Keep sticking to the plan!",
        timestamp: new Date(),
      },
    ],
  },
};

// --- Consolidated Sub-Components ---

export const MessageItem: StoryObj<typeof ChatMessage> = {
  render: () => (
    <div className="max-w-2xl space-y-4 p-4">
      <ChatMessage message={USER_MESSAGE} />
      <ChatMessage message={ASSISTANT_MESSAGE} />
    </div>
  ),
};

export const ActionPanel: StoryObj<typeof RightActionPanel> = {
  render: () => (
    <div className="bg-background flex h-[600px] w-full justify-end border">
      <div className="relative h-full w-80 border-l">
        <RightActionPanel
          isOpen={true}
          onClose={() => {}}
          recommendations={mockRecommendations}
          onGenerateSummary={() => {}}
          isGeneratingSummary={false}
        />
      </div>
    </div>
  ),
};

export const SavedChats: StoryObj<typeof SavedChatsView> = {
  render: () => (
    <div className="bg-background flex h-[600px] w-full border">
      <div className="relative h-full w-80 border-r">
        <SavedChatsView
          isOpen={true}
          onClose={() => {}}
          chats={[
            { id: '1', title: 'Marathon Prep' },
            { id: '2', title: 'Leg Day Recovery' },
          ]}
          onNewChat={() => {}}
        />
      </div>
    </div>
  ),
};

export const CheckIn: StoryObj<typeof CheckInModal> = {
  render: () => (
    <CheckInModal
      checkIn={CHECK_IN_DATA}
      isOpen={true}
      onRespond={async () => {}}
      onDismiss={() => {}}
      isLoading={false}
    />
  ),
};
