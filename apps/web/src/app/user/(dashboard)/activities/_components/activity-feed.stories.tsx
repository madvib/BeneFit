import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeedView, ActivityFeedItem } from './activity-feed';

const meta: Meta<typeof ActivityFeedView> = {
  title: 'Pages/Dashboard/ActivityFeed',
  component: ActivityFeedView,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityFeedView>;

// --- Mock Data ---

const MOCK_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: '1',
    type: 'strength',
    title: 'Upper Body Power',
    description: 'Completed 45 min workout with 3 PRs!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    duration: '45 min',
  },
  {
    id: '2',
    type: 'cardio',
    title: 'Morning Run',
    description: 'Completed 30 min workout. Average pace 5:30/km.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // Yesterday
    duration: '30 min',
  },
  {
    id: '3',
    type: 'yoga',
    title: 'Recovery Flow',
    description: 'Completed 20 min workout to ease stiffness.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    duration: '20 min',
  },
];

// --- Stories ---

export const DefaultFeed: Story = {
  name: 'Feed (With Data)',
  args: {
    activities: MOCK_ACTIVITIES,
    isLoading: false,
  },
};

export const Empty: Story = {
  name: 'Empty State',
  args: {
    activities: [],
    isLoading: false,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    activities: [],
    isLoading: true,
  },
};
