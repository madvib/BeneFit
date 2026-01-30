import type { Meta, StoryObj } from '@storybook/react';
import * as fixtures from '@bene/react-api-client/fixtures';
import { Carousel } from '@/lib/components';
import TodayView from './today-view';

// Mock Data using fixtures
const mockWorkoutResult = fixtures.buildGetTodaysWorkoutResponse({
  hasWorkout: true, // TODO: Fix typing in domain fixture options

});

// Unwrap the result to get the actual workout object
// If accessing .workout on valid response
const mockWorkout = mockWorkoutResult.isSuccess ? mockWorkoutResult.value.workout : undefined;

const meta: Meta = {
  title: 'Features/Today',
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
