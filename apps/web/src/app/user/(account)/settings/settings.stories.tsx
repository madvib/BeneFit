import type { Meta, StoryObj } from '@storybook/react';
import { FitnessGoalsForm } from './_components/fitness-goals-form';

const meta: Meta = {
  title: 'Pages/Account/Settings',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const FitnessGoals: StoryObj<typeof FitnessGoalsForm> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <FitnessGoalsForm
        initialPrimary="strength"
        initialSecondary={['consistency', 'recovery']}
        onSave={async (val) => {
          await new Promise((r) => setTimeout(r, 1000));
          alert(JSON.stringify(val, null, 2));
        }}
        isLoading={false}
      />
    </div>
  ),
};

export const FitnessGoalsLoading: StoryObj<typeof FitnessGoalsForm> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <FitnessGoalsForm
        initialPrimary="strength"
        initialSecondary={[]}
        onSave={async () => {}}
        isLoading={true}
      />
    </div>
  ),
};
