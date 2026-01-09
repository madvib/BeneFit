import type { Meta, StoryObj } from '@storybook/react';
import OnboardingStepper from './_components/onboarding-stepper';

const meta: Meta<typeof OnboardingStepper> = {
  title: 'Pages/Onboarding',
  component: OnboardingStepper,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof OnboardingStepper>;

export const Default: Story = {
  name: 'Onboarding Flow',
};
