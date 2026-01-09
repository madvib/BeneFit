import type { Meta, StoryObj } from '@storybook/react';
import { TrainingConstraintsForm } from './training-constraints-form';

const DEFAULT_CONSTRAINTS = {
  availableDays: ['Monday', 'Wednesday', 'Friday'],
  availableEquipment: ['dumbbells', 'bench'],
  maxDuration: 45,
  injuries: [],
};

const meta: Meta<typeof TrainingConstraintsForm> = {
  title: 'Settings/TrainingConstraintsForm',
  component: TrainingConstraintsForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TrainingConstraintsForm>;

export const Default: Story = {
  args: {
    initialConstraints: DEFAULT_CONSTRAINTS,
    onSave: async (value) => {
      console.log('Saved constraints:', value);
    },
    isLoading: false,
  },
};

export const WithInjuries: Story = {
  args: {
    initialConstraints: {
      ...DEFAULT_CONSTRAINTS,
      injuries: ['Knee pain (moderate)', 'Shoulder tightness'],
    },
    onSave: async (value) => {
      console.log('Saved constraints:', value);
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    initialConstraints: DEFAULT_CONSTRAINTS,
    isLoading: true,
  },
};
