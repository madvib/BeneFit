import type { Meta, StoryObj } from '@storybook/react';
import OnboardingWizard from './_components/onboarding-wizard';

const meta: Meta<typeof OnboardingWizard> = {
  title: 'Pages/Onboarding',
  component: OnboardingWizard,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof OnboardingWizard>;

export const Default: Story = {
  name: 'Onboarding Flow',
};
