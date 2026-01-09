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

import { mockCoachHistory } from '@/lib/testing/fixtures';

const MOCK_MESSAGES: MessageData[] = mockCoachHistory.messages.map((msg) => ({
  id: msg.id,
  role: msg.role as 'user' | 'assistant', // Map 'coach' -> 'assistant' if needed, or fix fixture
  content: msg.content,
  timestamp: new Date(msg.timestamp),
}));

// Fix role mapping if fixture uses 'coach' but UI uses 'assistant'
// The fixture says 'coach', UI says 'assistant'.
// Let's map 'coach' to 'assistant'
const mapRole = (role: string) => (role === 'coach' ? 'assistant' : role);
for (const m of MOCK_MESSAGES) m.role = mapRole(m.role) as MessageData['role'];

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
