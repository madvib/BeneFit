import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { workoutScenarios, profileScenarios } from '@bene/react-api-client/test';
import { useWorkoutHistory, useProfile } from '@bene/react-api-client';
import type { CompletedWorkout } from '@bene/react-api-client';
import { ActivityFeedView } from './feed/activity-feed-view';
import { WorkoutHistoryDetailModal } from './history/workout-history-detail-modal';

const meta: Meta<typeof ActivityFeedView> = {
  title: 'Features/Activities',
  component: ActivityFeedView,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        ...workoutScenarios.default,
        ...profileScenarios.default,
      ],
    },
  },
};

export default meta;


const InteractiveFeed = ({ 
  defaultTab = 'feed',
  isError = false
}: { 
  defaultTab?: 'feed' | 'history',
  isError?: boolean
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);
  const workoutQuery = useWorkoutHistory({ query: {} });
  const profileQuery = useProfile();

  if (isError || workoutQuery.isError) {
    return (
      <div className="mx-auto max-w-xl py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Failed to load activities.
        </div>
      </div>
    );
  }

  if (workoutQuery.isLoading || profileQuery.isLoading) {
      return <div className="mx-auto max-w-xl py-8">Loading activities...</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-xl py-8">
        <ActivityFeedView
          defaultTab={defaultTab}
          workouts={workoutQuery.data?.workouts ?? []}
          onSelectWorkout={setSelectedWorkout}
          userProfile={profileQuery.data ?? { displayName: 'User' }}
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

export const Empty: StoryObj<typeof ActivityFeedView> = {
  parameters: {
    msw: {
      handlers: [
        ...workoutScenarios.emptyHistory,
      ],
    },
  },
  render: () => <InteractiveFeed />,
};

export const LoadError: StoryObj<typeof ActivityFeedView> = {
  render: () => <InteractiveFeed isError={true} />,
};

