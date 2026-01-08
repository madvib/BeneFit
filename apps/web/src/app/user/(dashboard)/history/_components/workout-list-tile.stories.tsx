import type { Meta, StoryObj } from '@storybook/react';
import WorkoutListTile from './workout-list-tile';
import type { WorkoutData } from './workout-list';

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

const COMPLETED_STRENGTH: WorkoutData = {
  id: '1',
  type: 'strength',
  date: '2026-01-07',
  duration: '45 min',
  calories: '320',
  status: 'completed',
};

const COMPLETED_CARDIO: WorkoutData = {
  id: '2',
  type: 'cardio',
  date: '2026-01-06',
  duration: '30 min',
  calories: '280',
  status: 'completed',
};

const IN_PROGRESS_YOGA: WorkoutData = {
  id: '3',
  type: 'yoga',
  date: '2026-01-07',
  duration: '20 min',
  calories: undefined,
  status: 'in progress',
};

const SKIPPED_HIIT: WorkoutData = {
  id: '4',
  type: 'hiit',
  date: '2026-01-05',
  duration: undefined,
  calories: undefined,
  status: 'skipped',
};

const NO_CALORIES: WorkoutData = {
  id: '5',
  type: 'flexibility',
  date: '2026-01-04',
  duration: '15 min',
  calories: undefined,
  status: 'completed',
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

export const Skipped: Story = {
  name: 'Skipped Workout',
  args: SKIPPED_HIIT,
};

export const NoCalories: Story = {
  name: 'Workout Without Calories',
  args: NO_CALORIES,
};

export const LongDuration: Story = {
  name: 'Long Duration Workout',
  args: {
    id: '6',
    type: 'endurance',
    date: '2026-01-03',
    duration: '2h 15min',
    calories: '850',
    status: 'completed',
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
        <WorkoutListTile {...SKIPPED_HIIT} />
      </tbody>
    </table>
  ),
};
