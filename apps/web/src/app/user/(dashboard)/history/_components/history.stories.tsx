import type { Meta, StoryObj } from '@storybook/react';
import WorkoutList from './workout-list';
import HistoryModal from './history-modal';
import { useState } from 'react';
import { Button } from '@/lib/components';

import { mockWorkoutHistory, mockCompletedWorkout } from '@/lib/testing/fixtures';

// Map domain fixture to UI model
const MOCK_HISTORY_ITEMS = [
  mockCompletedWorkout,
  {
    ...mockCompletedWorkout,
    id: 'h2',
    workoutType: 'Cardio Run',
    performance: {
      ...mockCompletedWorkout.performance,
      durationMinutes: 30,
      caloriesBurned: 300,
    },
    recordedAt: '2026-01-08T08:00:00Z',
  },
];

const meta: Meta = {
  title: 'Pages/Dashboard/History',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

// --- Workout List Stories ---

export const ListPopulated: StoryObj<typeof WorkoutList> = {
  render: () => (
    <div className="max-w-4xl p-4">
      <WorkoutList
        workouts={MOCK_HISTORY_ITEMS}
        onEdit={(id) => alert(`Edit ${id}`)}
        onDelete={(id) => alert(`Delete ${id}`)}
      />
    </div>
  ),
};

export const ListLoading: StoryObj<typeof WorkoutList> = {
  render: () => (
    <div className="max-w-4xl p-4">
      <WorkoutList workouts={[]} loading={true} />
    </div>
  ),
};

export const ListEmpty: StoryObj<typeof WorkoutList> = {
  render: () => (
    <div className="max-w-4xl p-4">
      <WorkoutList workouts={[]} emptyMessage="No workouts found for this period." />
    </div>
  ),
};

// --- History Modal Stories ---

export const ModalOpen: StoryObj<typeof HistoryModal> = {
  render: () => {
    return (
      <div className="bg-muted/20 item-center relative flex h-[600px] w-full justify-center">
        <p className="text-muted-foreground absolute top-4">Modal is open over this content</p>
        <HistoryModal isOpen={true} onClose={() => {}} workout={mockCompletedWorkout} />
      </div>
    );
  },
};

// Interactive Modal Trigger
const InteractiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-[200px] items-center justify-center">
      <Button onClick={() => setIsOpen(true)}>Open History Modal</Button>
      <HistoryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        workout={mockCompletedWorkout}
      />
    </div>
  );
};

export const ModalInteractive: StoryObj = {
  render: () => <InteractiveModal />,
};
