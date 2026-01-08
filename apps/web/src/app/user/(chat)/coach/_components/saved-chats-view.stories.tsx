import type { Meta, StoryObj } from '@storybook/react';
import SavedChatsView from './saved-chats-view';

const meta: Meta<typeof SavedChatsView> = {
  title: 'Pages/Coach/SavedChatsView',
  component: SavedChatsView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-background flex h-screen w-full">
        <div className="relative h-full w-80 border-r">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SavedChatsView>;

// --- Mock Data ---

const MOCK_CHATS = [
  { id: '1', title: 'How to improve my squat form?' },
  { id: '2', title: 'Weekly progress check-in' },
  { id: '3', title: 'Nutrition advice for muscle gain' },
  { id: '4', title: 'Dealing with knee pain during runs' },
  { id: '5', title: 'Best recovery strategies' },
  { id: '6', title: 'Adjusting my training plan' },
  { id: '7', title: 'Pre-workout meal suggestions' },
  { id: '8', title: 'Sleep and performance' },
];

// --- Stories ---

export const Default: Story = {
  name: 'List View',
  args: {
    isOpen: true,
    onClose: () => console.log('Close sidebar'),
    chats: MOCK_CHATS,
    onNewChat: () => console.log('New chat clicked'),
  },
};

export const Empty: Story = {
  name: 'Empty State',
  args: {
    isOpen: true,
    onClose: () => console.log('Close sidebar'),
    chats: [],
    onNewChat: () => console.log('New chat clicked'),
  },
};
