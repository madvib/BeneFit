import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutDetailSheet } from './workout-detail-sheet';

const meta = {
  title: 'Plan/WorkoutDetailSheet',
  component: WorkoutDetailSheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WorkoutDetailSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

import { mockWorkoutTemplate } from '@/lib/testing/fixtures/workouts';

export const Default: Story = {
  args: {
    workout: mockWorkoutTemplate,
    open: true,
    onOpenChange: () => {},
  },
};

export const CompletedWorkout: Story = {
  args: {
    workout: {
      ...mockWorkoutTemplate,
      status: 'completed',
      completedWorkoutId: 'completed-123',
    },
    open: true,
    onOpenChange: () => {},
  },
};

export const CriticalWorkout: Story = {
  args: {
    workout: {
      ...mockWorkoutTemplate,
      importance: 'critical',
      title: 'Deload Week - Recovery Session',
      coachNotes:
        'This is a critical recovery workout. Do NOT skip this. Your body needs this to adapt to the training stress.',
    },
    open: true,
    onOpenChange: () => {},
  },
};
