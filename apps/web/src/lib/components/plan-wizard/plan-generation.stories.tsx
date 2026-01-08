import type { Meta, StoryObj } from '@storybook/react';
import PlanGenerationWizard from './plan-generation-wizard';

const meta: Meta<typeof PlanGenerationWizard> = {
  title: 'Components/Plan Generation',
  component: PlanGenerationWizard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PlanGenerationWizard>;

export const Default: Story = {
  name: 'Plan Generation Flow',
  args: {
    onComplete: (plan) => console.log('Plan generated:', plan),
    onSkip: () => console.log('Skipped'),
  },
};
