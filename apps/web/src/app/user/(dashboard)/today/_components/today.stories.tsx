import type { Meta, StoryObj } from '@storybook/react';
import TodayView from './today-view';
import { Carousel } from '@/lib/components';
import { fixtures } from '@bene/react-api-client';

// Mock Data using fixtures
const mockWorkoutResponse = fixtures.createGetTodaysWorkoutResponse({
  hasWorkout: true as any,
  workout: {
    workoutId: 'w_123',
    planId: 'p_456',
    type: 'Upper Body Power',
    durationMinutes: 45,
    activities: [
      { type: 'warmup', instructions: '5 min light jogging', durationMinutes: 5 },
      { type: 'main', instructions: '3 sets of 8 reps @ RPE 8', durationMinutes: 15 },
      { type: 'main', instructions: '3 sets to failure', durationMinutes: 10 },
      { type: 'cooldown', instructions: 'Static stretching', durationMinutes: 15 },
    ],
  } as any, 
});

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
          todaysWorkout={mockWorkoutResponse.workout}
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
