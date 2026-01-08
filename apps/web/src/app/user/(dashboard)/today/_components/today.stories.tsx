import type { Meta, StoryObj } from '@storybook/react';
import TodayView from './today-view';
import SkipWorkoutModal from './skip-workout-modal';

// Mock Data
const MOCK_WORKOUT_TODAY = {
  workoutId: 'w_123',
  planId: 'p_456',
  type: 'Upper Body Power',
  durationMinutes: 45,
  activities: [
    { type: 'Warmup', instructions: '5 min light jogging', durationMinutes: 5 },
    { type: 'Bench Press', instructions: '3 sets of 8 reps @ RPE 8', durationMinutes: 15 },
    { type: 'Pull Ups', instructions: '3 sets to failure', durationMinutes: 10 },
    { type: 'Cooldown', instructions: 'Static stretching', durationMinutes: 15 },
  ],
};

const meta: Meta = {
  title: 'Pages/Dashboard/Today',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

// --- Today View Stories ---

export const WorkoutScheduled: StoryObj<typeof TodayView> = {
  render: () => (
    <TodayView
      todaysWorkout={MOCK_WORKOUT_TODAY}
      isLoading={false}
      error={null}
      onStartWorkout={() => alert('Start Workout')}
      onSkipWorkout={async () => new Promise((r) => setTimeout(r, 1000))}
      isStarting={false}
      isSkipping={false}
    />
  ),
};

export const WorkoutLoading: StoryObj<typeof TodayView> = {
  render: () => (
    <TodayView
      todaysWorkout={undefined}
      isLoading={true}
      error={null}
      onStartWorkout={() => {}}
      onSkipWorkout={async () => {}}
      isStarting={false}
      isSkipping={false}
    />
  ),
};

export const RestDay: StoryObj<typeof TodayView> = {
  render: () => (
    <TodayView
      todaysWorkout={undefined}
      isLoading={false}
      error={null}
      onStartWorkout={() => {}}
      onSkipWorkout={async () => {}}
      isStarting={false}
      isSkipping={false}
    />
  ),
};

export const ErrorState: StoryObj<typeof TodayView> = {
  render: () => (
    <TodayView
      todaysWorkout={undefined}
      isLoading={false}
      error={new Error('Failed to fetch plan')}
      onStartWorkout={() => {}}
      onSkipWorkout={async () => {}}
      isStarting={false}
      isSkipping={false}
    />
  ),
};

// --- Skip Modal Stories ---

export const SkipModalOpen: StoryObj<typeof SkipWorkoutModal> = {
  render: () => {
    return (
      <div className="bg-muted/20 relative flex h-[500px] w-full items-center justify-center">
        <SkipWorkoutModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={(reason) => alert(`Skipping for: ${reason}`)}
          isLoading={false}
        />
      </div>
    );
  },
};
