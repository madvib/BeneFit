import type { Meta, StoryObj } from '@storybook/react';
import WorkoutList, { WorkoutData } from './workout-list';
import HistoryModal from './history-modal';
import { useState } from 'react';
import { Button } from '@/lib/components';

const MOCK_WORKOUTS: WorkoutData[] = [
  {
    id: '1',
    date: '2025-10-26T08:00:00Z',
    type: 'Cardio',
    duration: '45 min',
    calories: 320,
    distance: '5.2 km',
    status: 'completed',
  },
  {
    id: '2',
    date: '2025-10-25T18:30:00Z',
    type: 'Strength',
    duration: '60 min',
    calories: 210,
    sets: 15,
    status: 'completed',
  },
  {
    id: '3',
    date: '2025-10-23T07:00:00Z',
    type: 'Flexibility',
    duration: '30 min',
    calories: 120,
    status: 'completed',
  },
  {
    id: '4',
    date: '2025-10-22T08:00:00Z',
    type: 'HIIT',
    duration: '25 min',
    calories: 280,
    status: 'in progress',
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
        workouts={MOCK_WORKOUTS}
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
        <HistoryModal
          isOpen={true}
          onClose={() => {}}
          workouts={[
            {
              id: '1',
              date: 'Today, 8:00 AM',
              workout: 'Morning Run',
              duration: '30 min',
              calories: '320 kcal',
              type: 'Cardio',
            },
            {
              id: '2',
              date: 'Yesterday, 6:30 PM',
              workout: 'Upper Body Power',
              duration: '45 min',
              calories: '210 kcal',
              type: 'Strength',
            },
          ]}
        />
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
      <HistoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const ModalInteractive: StoryObj = {
  render: () => <InteractiveModal />,
};
