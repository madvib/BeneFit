import type { Meta, StoryObj } from '@storybook/react';
import OnboardingStepper from './_components/onboarding-stepper';
import { Aurora, PageContainer } from '@/lib/components';

const meta: Meta<typeof OnboardingStepper> = {
  title: 'Features/Onboarding',
  component: OnboardingStepper,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof OnboardingStepper>;

export const Default: Story = {
  name: 'Onboarding Flow',
  render: () => (
    <PageContainer variant="fullViewport" className="relative flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Aurora />
      </div>
      <div className="relative z-10 w-full max-w-4xl px-4">
        <OnboardingStepper />
      </div>
    </PageContainer>
  ),
};
