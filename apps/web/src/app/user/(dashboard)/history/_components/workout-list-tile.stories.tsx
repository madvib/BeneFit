import type { Meta, StoryObj } from '@storybook/react';
import {
  mockCompletedWorkout,
  mockWorkoutSession,
  mockAbandonedSession,
} from '@/lib/testing/fixtures';
import type { WorkoutSession, CompletedWorkout } from '@bene/shared';
import WorkoutListTile from './workout-list-tile';

const meta: Meta<typeof WorkoutListTile> = {
  title: 'Pages/Dashboard/History/WorkoutListTile',
  component: WorkoutListTile,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <table className="w-full">
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WorkoutListTile>;

// --- Mock Data ---

const COMPLETED_STRENGTH: CompletedWorkout = mockCompletedWorkout;

const COMPLETED_CARDIO: CompletedWorkout = {
  ...mockCompletedWorkout,
  id: '2',
  workoutType: 'Cardio Run',
  performance: {
    ...mockCompletedWorkout.performance,
    durationMinutes: 30,
    caloriesBurned: 280,
  },
};

const IN_PROGRESS_YOGA: WorkoutSession = mockWorkoutSession;

const ABANDONED_HIIT: WorkoutSession = mockAbandonedSession;

const NO_CALORIES: CompletedWorkout = {
  ...mockCompletedWorkout,
  id: '5',
  workoutType: 'Flexibility',
  performance: {
    ...mockCompletedWorkout.performance,
    durationMinutes: 15,
    caloriesBurned: undefined,
  },
};

// --- Stories ---

export const CompletedStrength: Story = {
  name: 'Completed Strength Workout',
  args: COMPLETED_STRENGTH,
};

export const CompletedCardio: Story = {
  name: 'Completed Cardio Workout',
  args: COMPLETED_CARDIO,
};

export const InProgress: Story = {
  name: 'In Progress Workout',
  args: IN_PROGRESS_YOGA,
};

export const Abandoned: Story = {
  name: 'Abandoned Workout',
  args: ABANDONED_HIIT,
};

export const NoCalories: Story = {
  name: 'Workout Without Calories',
  args: NO_CALORIES,
};

export const LongDuration: Story = {
  name: 'Long Duration Workout',
  args: {
    ...mockCompletedWorkout,
    id: '6',
    workoutType: 'Endurance Event',
    performance: {
      ...mockCompletedWorkout.performance,
      durationMinutes: 135,
      caloriesBurned: 850,
    },
  },
};

export const MultipleRows: Story = {
  name: 'Multiple Workout Rows',
  render: () => (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-6 py-3 text-left text-sm font-semibold">Workout</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Details</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
          <th className="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody>
        <WorkoutListTile {...COMPLETED_STRENGTH} />
        <WorkoutListTile {...COMPLETED_CARDIO} />
        <WorkoutListTile {...IN_PROGRESS_YOGA} />
        <WorkoutListTile {...ABANDONED_HIIT} />
      </tbody>
    </table>
  ),
};
