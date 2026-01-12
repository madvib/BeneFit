import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeedView } from './activity-feed-view';
import ActivityFeed from './activity-feed';
import WorkoutList from './workout-list';
import { WorkoutHistoryDetailModal } from './workout-history-detail-modal';
import { mockWorkoutHistory } from '@/lib/testing/fixtures';
import type { CompletedWorkout } from '@bene/shared';
import { typography } from '../../../../../../lib/components/theme/typography';

const meta: Meta<typeof ActivityFeedView> = {
  title: 'Features/Activity/ActivityFeedView',
  component: ActivityFeedView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ActivityFeedView>;

export const Default: Story = {
  render: () => (
    <div className="mx-auto max-w-xl py-8">
      <ActivityFeedView
        workouts={mockWorkoutHistory.workouts}
        onSelectWorkout={(w) => console.log('Selected', w)}
        userProfile={{ displayName: 'Test User' }}
      />
    </div>
  ),
};

export const HistoryTab: Story = {
  render: () => (
    <div className="mx-auto max-w-xl py-8">
      <ActivityFeedView
        defaultTab="history"
        workouts={mockWorkoutHistory.workouts}
        onSelectWorkout={(w) => console.log('Selected', w)}
        userProfile={{ displayName: 'Test User' }}
      />
    </div>
  ),
};

const WithDetailModalWrapper = () => {
  const [selected, setSelected] = useState<CompletedWorkout | null>(
    mockWorkoutHistory.workouts[0],
  );

  return (
    <div className="mx-auto max-w-xl py-8">
      <ActivityFeedView
        defaultTab="history"
        workouts={mockWorkoutHistory.workouts}
        onSelectWorkout={setSelected}
        userProfile={{ displayName: 'Test User' }}
      />
      <WorkoutHistoryDetailModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        workout={selected}
      />
    </div>
  );
};

export const WithDetailModal: Story = {
  render: () => <WithDetailModalWrapper />,
};

export const RecentActivity: Story = {
  render: () => (
    <div className="max-w-2xl">
      <ActivityFeed />
    </div>
  ),
};

export const HistoryList: Story = {
  render: () => (
    <div className="max-w-4xl">
      <WorkoutList workouts={mockWorkoutHistory.workouts} />
    </div>
  ),
};

const WorkoutHistoryDetailWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-accent/20 flex h-[800px] w-full items-center justify-center p-8">
      <WorkoutHistoryDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        workout={mockWorkoutHistory.workouts[0]}
      />
      <div className="text-center">
        <p className={`${typography.small} text-muted-foreground mb-4`}>Modal Closed</p>
        <button
          onClick={() => setIsOpen(true)}
          className={`${typography.labelSm} bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-all`}
        >
          Open Modal
        </button>
      </div>
    </div>
  );
};

export const WorkoutHistoryDetail: Story = {
  render: () => <WorkoutHistoryDetailWrapper />,
};
