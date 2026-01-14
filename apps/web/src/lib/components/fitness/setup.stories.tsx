import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { mockTrainingConstraints } from '../../testing/fixtures';
import {
  PrimaryGoalGrid,
  CategorizedEquipmentSelection,
  FitnessGoalsForm,
  FitnessPreferences,
  TrainingConstraintsForm,
} from './index';

const meta: Meta = {
  title: 'Components/Fitness/Setup',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const PlanningForms: StoryObj = {
  name: 'Planning Forms',
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="max-w-md">
        <PrimaryGoalGrid selected="strength" onChange={() => {}} />
      </div>
      <div className="max-w-md">
        <CategorizedEquipmentSelection
          selected={mockTrainingConstraints.availableEquipment}
          onChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const FitnessGoalsFormStory: StoryObj<typeof FitnessGoalsForm> = {
  name: 'Fitness Goals Form',
  render: () => (
    <div className="max-w-xl p-4">
      <FitnessGoalsForm
        initialPrimary="strength"
        initialSecondary={['build_muscle', 'improve_endurance']}
        onSave={async (data) => {
          console.log('Save Goals', data);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        isLoading={false}
      />
    </div>
  ),
};

const FitnessPreferencesWrapper = () => {
  const [units, setUnits] = React.useState<'metric' | 'imperial'>('metric');
  const [focus, setFocus] = React.useState<
    'motivational' | 'casual' | 'professional' | 'tough_love'
  >('motivational');
  return (
    <div className="max-w-2xl p-4">
      <FitnessPreferences
        preferredUnits={units}
        goalFocus={focus}
        onPreferredUnitsChange={setUnits}
        onGoalFocusChange={setFocus}
      />
    </div>
  );
};

export const FitnessPreferencesStory: StoryObj<typeof FitnessPreferences> = {
  name: 'Fitness Preferences',
  render: () => <FitnessPreferencesWrapper />,
};

export const TrainingConstraintsStory: StoryObj<typeof TrainingConstraintsForm> = {
  name: 'Training Constraints',
  render: () => (
    <div className="max-w-xl p-4">
      <TrainingConstraintsForm
        initialConstraints={{
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          availableEquipment: ['dumbbells'],
          maxDuration: 45,
          injuries: [],
        }}
        onSave={async (val) => console.log(val)}
        isLoading={false}
      />
    </div>
  ),
};
