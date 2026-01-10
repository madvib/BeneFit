import type { Meta, StoryObj } from '@storybook/react';
import OnboardingStepper from './_components/onboarding-stepper';
import PlanGenerationStepper from '@/lib/components/fitness/steppers/plan-generation-stepper';

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
};

// --- Plan Generation Stories ---

export const PlanGeneration: StoryObj<typeof PlanGenerationStepper> = {
  render: () => (
    <div className="flex justify-center p-8">
      <PlanGenerationStepper
        onComplete={(plan) => console.log('Plan generated:', plan)}
        onSkip={() => console.log('Skipped')}
      />
    </div>
  ),
};
