import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as fixtures from '@bene/react-api-client/fixtures';
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
  render: () => {
    // Generate sample constraints data
    const constraints = fixtures.buildTrainingConstraintsResponse();
    
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="max-w-md">
          <PrimaryGoalGrid selected="strength" onChange={() => {}} />
        </div>
        <div className="max-w-md">
          <CategorizedEquipmentSelection
            selected={constraints.availableEquipment}
            onChange={() => {}}
          />
        </div>
      </div>
    );
  },
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

export const TrainingConstraints: StoryObj<typeof TrainingConstraintsForm> = {
  name: 'Training Constraints (Default)',
  render: () => {
    const mockConstraints = fixtures.buildTrainingConstraintsResponse(undefined, { seed: 500 });
    return (
      <div className="max-w-xl p-4">
        <TrainingConstraintsForm
          initialConstraints={mockConstraints}
          onSave={async (val) => {
             console.log('Saved:', val);
             await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
          isLoading={false}
        />
      </div>
    );
  },
};
