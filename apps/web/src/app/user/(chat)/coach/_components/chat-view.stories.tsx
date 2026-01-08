import type { Meta, StoryObj } from '@storybook/react';
import ChatView from './chat-view';
import { MessageData } from './types';

const meta: Meta<typeof ChatView> = {
  title: 'Pages/Coach/ChatView',
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

const MOCK_MESSAGES: MessageData[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hi coach, I feel a bit tired today. Should I skip my workout?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
  },
  {
    id: '2',
    role: 'assistant',
    content:
      "It depends on how tired you are. If it's just general fatigue, a light recovery session might actually help! But if you're feeling exhausted or sick, rest is better. How would you rate your energy level from 1-10?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: '3',
    role: 'user',
    content: 'Probably a 4. just stressful day at work.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '4',
    role: 'assistant',
    content:
      "Got it. Stress fatigue is real. Let's modify today's plan. instead of the HIIT session, let's do 20 mins of Zone 2 cardio and some stretching. Does that sound manageable?",
    timestamp: new Date(Date.now() - 1000 * 30),
  },
];

// --- Stories ---

import { ChatUIProvider } from '@/lib/hooks/use-chat-ui';
import { SavedChatsView, RightActionPanel } from './index';
import ChatHeader from '../../_components/chat-header';

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
            isOpen={true} // Force open for demo
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
