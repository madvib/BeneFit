import type { Meta, StoryObj } from '@storybook/react';
import ChatMessage from './chat-message';
import type { MessageData } from './types';

const meta: Meta<typeof ChatMessage> = {
  title: 'Pages/Coach/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatMessage>;

// --- Mock Data ---

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
    "It depends on how tired you are. If it's just general fatigue, a light recovery session might actually help! But if you're feeling exhausted or sick, rest is better. How would you rate your energy level from 1-10?",
  timestamp: new Date(),
};

const LONG_USER_MESSAGE: MessageData = {
  id: '3',
  role: 'user',
  content:
    "I've been following the program for about 3 weeks now and I'm seeing some progress, but I'm wondering if I should increase the weight on my compound lifts. My squat has gone from 135 to 155 lbs, bench from 95 to 105 lbs, and deadlift from 185 to 205 lbs. I'm able to complete all sets with good form, but the last rep of the last set is definitely challenging. What do you think?",
  timestamp: new Date(),
};

const LONG_ASSISTANT_MESSAGE: MessageData = {
  id: '4',
  role: 'assistant',
  content:
    "That's excellent progress for 3 weeks! Those are solid strength gains. Based on what you're describing, you're in a great position to progress. Here's my recommendation:\n\n1. For squat and deadlift, add 5-10 lbs next session\n2. For bench press, add 2.5-5 lbs (upper body progresses slower)\n3. If you complete all reps with good form, continue adding weight\n4. If you fail to hit your target reps, stay at that weight for another session\n\nRemember: Progressive overload is key, but so is maintaining proper form. Never sacrifice form for weight!",
  timestamp: new Date(),
};

// --- Stories ---

// --- Stories ---

export const Overview: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">User Message</h3>
        <ChatMessage message={USER_MESSAGE} />
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">Assistant Message</h3>
        <ChatMessage message={ASSISTANT_MESSAGE} />
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">Long User Message (Wrapped)</h3>
        <ChatMessage message={LONG_USER_MESSAGE} />
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">
          Long Assistant Message (Wrapped)
        </h3>
        <ChatMessage message={LONG_ASSISTANT_MESSAGE} />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    message: ASSISTANT_MESSAGE,
  },
  argTypes: {
    message: {
      control: 'object',
    },
  },
};
