import type { Meta, StoryObj } from '@storybook/react';
import SkipWorkoutModal from './skip-workout-modal';

const meta: Meta<typeof SkipWorkoutModal> = {
  title: 'Pages/Dashboard/Today/SkipWorkoutModal',
  component: SkipWorkoutModal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SkipWorkoutModal>;

// --- Stories ---

export const Default: Story = {
  name: 'Default Modal',
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: (reason: string, notes?: string) => console.log('Confirmed:', { reason, notes }),
    isLoading: false,
  },
};

export const Loading: Story = {
  name: 'Submitting (Loading)',
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: (reason: string, notes?: string) => console.log('Confirmed:', { reason, notes }),
    isLoading: true,
  },
};

export const Closed: Story = {
  name: 'Modal Closed',
  args: {
    isOpen: false,
    onClose: () => console.log('Modal closed'),
    onConfirm: (reason: string, notes?: string) => console.log('Confirmed:', { reason, notes }),
    isLoading: false,
  },
};

export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: (reason: string, notes?: string) => console.log('Confirmed:', { reason, notes }),
    isLoading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
