import type { Meta, StoryObj } from '@storybook/react';
import { fixtures } from '@bene/react-api-client/fixtures';
import { CoachPageContent } from '../page';
import { ChatHeader } from '@/lib/components';

// Generate consistent coach history with seed
const mockCoachHistory = fixtures.coach.buildGetCoachHistoryResponse(undefined, { seed: 300 });

const meta: Meta<typeof CoachPageContent> = {
  title: 'Features/Coach',
  component: CoachPageContent,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    historyData: {
      ...mockCoachHistory,
      messages: [], // Start empty for default
      pendingCheckIns: [], // Ensure no modal pops up
    },
  },
};

export default meta;
type Story = StoryObj<typeof CoachPageContent>;


export const Default: Story = {
  render: (args) => (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background">
      <ChatHeader title="AI Coach" />
      <CoachPageContent {...args} />
    </div>
  ),
};

// Generate a long conversation to test scrolling
const scrollMessages = Array.from({ length: 20 }).flatMap((_, i) => [
  {
    id: `u-${i}`,
    content: `User message ${i + 1}. This is multiple lines of text to ensure we take up some vertical space in the chat bubble.`,
    role: 'user' as const,
    timestamp: new Date(Date.now() - (20 - i) * 1000 * 60),
    sender: 'user', // Backwards compatibility if component needs it
    sentAt: new Date(Date.now() - (20 - i) * 1000 * 60).toISOString(),
  },
  {
    id: `c-${i}`,
    content: `Coach response ${i + 1}. I am analyzing your request and providing detailed feedback based on your recent performance metrics and sleep data.`,
    role: 'coach' as const,
    timestamp: new Date(Date.now() - (20 - i) * 1000 * 60 + 30_000),
    sender: 'coach',
    sentAt: new Date(Date.now() - (20 - i) * 1000 * 60 + 30_000).toISOString(),
  },
]);

export const WithMessages: Story = {
  render: (args) => (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background">
      <ChatHeader title="AI Coach" />
      <CoachPageContent {...args} />
    </div>
 ),
  args: {
    historyData: {
      ...mockCoachHistory,
      messages: [
        ...mockCoachHistory.messages, // Include fixture messages
        ...scrollMessages, // Add generated scrolling messages
      ],
      pendingCheckIns: [], // Ensure no modal pops up
    },
  },
};

export const WithCheckIn: Story = {
  render: (args) => (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background">
      <ChatHeader title="AI Coach" />
      <CoachPageContent {...args} />
    </div>
  ),
  args: {
    historyData: {
      ...mockCoachHistory,
      messages: [],
      // Use default mockCoachHistory which has pendingCheckIns
    },
  },
};

