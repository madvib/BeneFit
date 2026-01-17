import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fixtures } from '@bene/react-api-client';
import type { CompletedWorkout } from '@bene/react-api-client';
import { ActivityFeedView } from './feed/activity-feed-view';
import { WorkoutHistoryDetailModal } from './history/workout-history-detail-modal';

// Generate consistent workout history with seed
const mockWorkoutHistory = fixtures.createGetWorkoutHistoryResponse(undefined, { seed: 400 });

const meta: Meta<typeof ActivityFeedView> = {
  title: 'Features/Activities',
  component: ActivityFeedView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;


const InteractiveFeed = ({ defaultTab = 'feed' }: { defaultTab?: 'feed' | 'history' }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  return (
    <>
      <div className="mx-auto max-w-xl py-8">
        <ActivityFeedView
          defaultTab={defaultTab}
          workouts={mockWorkoutHistory.workouts}
          onSelectWorkout={setSelectedWorkout}
          userProfile={{ displayName: 'Test User' }}
        />
      </div>
      <WorkoutHistoryDetailModal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        workout={selectedWorkout}
      />
    </>
  );
};

export const Default: StoryObj<typeof ActivityFeedView> = {
  render: () => <InteractiveFeed />,
};

