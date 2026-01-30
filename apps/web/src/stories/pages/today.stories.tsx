import type { Meta, StoryObj } from '@storybook/react';
import * as fixtures from '@bene/react-api-client/fixtures';
import { Carousel } from '@/lib/components';
import { Route } from '@/routes/$user/_dashboard/today';
import TodayView from '@/routes/$user/_dashboard/-components/today';

const mockWorkoutResult = fixtures.buildGetTodaysWorkoutResponse({
  hasWorkout: true,
});

const mockWorkout = mockWorkoutResult.isSuccess ? mockWorkoutResult.value.workout : undefined;

const meta: Meta = {
  title: 'Pages/Today', // Changed to Pages/ to group them
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Showcase: StoryObj<typeof TodayView> = {
  render: () => (
    <Carousel>
      {/* Workout Scheduled */}
      <div className="mx-auto w-full max-w-2xl">
        <TodayView
          todaysWorkout={mockWorkout}
          isLoading={false}
          error={null}
          onStartWorkout={() => alert('Start Workout')}
          onSkipWorkout={async () => new Promise((r) => setTimeout(r, 1000))}
          isStarting={false}
          isSkipping={false}
        />
      </div>
      {/* Rest Day */}
      <div className="mx-auto w-full max-w-2xl">
        <TodayView
          todaysWorkout={undefined}
          isLoading={false}
          error={null}
          onStartWorkout={() => {}}
          onSkipWorkout={async () => {}}
          isStarting={false}
          isSkipping={false}
        />
      </div>
    </Carousel>
  ),
};

export const ErrorState: StoryObj<typeof TodayView> = {
  render: () => (
    <div className="mx-auto w-full max-w-2xl">
      <TodayView
        todaysWorkout={undefined}
        isLoading={false}
        error={new Error('Failed to fetch plan')}
        onStartWorkout={() => {}}
        onSkipWorkout={async () => {}}
        isStarting={false}
        isSkipping={false}
      />
    </div>
  ),
};
