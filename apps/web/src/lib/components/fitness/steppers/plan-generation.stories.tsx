import type { Meta, StoryObj } from '@storybook/react';
import PlanGenerationStepper from './plan-generation-stepper';

const meta: Meta<typeof PlanGenerationStepper> = {
  title: 'Components/Plan Generation',
  component: PlanGenerationStepper,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PlanGenerationStepper>;

export const Default: Story = {
  name: 'Plan Generation Flow',
  args: {
    onComplete: (plan) => console.log('Plan generated:', plan),
    onSkip: () => console.log('Skipped'),
  },
};
