import type { Meta, StoryObj } from '@storybook/react';
import { mockUserStats, mockTrainingConstraints, mockDailyWorkout } from '../../testing/fixtures';
import {
  StatisticsSection,
  ProgressChart,
  WorkoutSummary,
  PrimaryGoalGrid,
  CategorizedEquipmentSelection,
  PlanGenerationStepper,
  SkipWorkoutModal,
} from './index';

const meta: Meta = {
  title: 'Components/Fitness',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Statistics: StoryObj<typeof StatisticsSection> = {
  render: () => (
    <div className="max-w-2xl">
      <StatisticsSection stats={mockUserStats} />
    </div>
  ),
};

export const WeeklyProgress: StoryObj<typeof ProgressChart> = {
  render: () => (
    <div className="max-w-2xl">
      <ProgressChart
        data={[
          { date: 'Mon', value: 5 },
          { date: 'Tue', value: 8 },
          { date: 'Wed', value: 3 },
          { date: 'Thu', value: 10 },
          { date: 'Fri', value: 7 },
          { date: 'Sat', value: 12 },
          { date: 'Sun', value: 4 },
        ]}
      />
    </div>
  ),
};

export const Summary: StoryObj<typeof WorkoutSummary> = {
  render: () => (
    <div className="max-w-2xl">
      <WorkoutSummary workout={mockDailyWorkout} />
    </div>
  ),
};

export const GoalSelection: StoryObj = {
  render: () => (
    <div className="max-w-md">
      <PrimaryGoalGrid selected="strength" onChange={() => {}} />
    </div>
  ),
};

export const EquipmentSelection: StoryObj = {
  render: () => (
    <div className="max-w-md">
      <CategorizedEquipmentSelection
        selected={mockTrainingConstraints.availableEquipment}
        onChange={() => {}}
      />
    </div>
  ),
};

export const PlanGeneration: StoryObj = {
  render: () => (
    <div className="bg-background mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-xl">
      <PlanGenerationStepper onComplete={(p) => console.log(p)} onSkip={() => {}} />
    </div>
  ),
};

export const SkipWorkout: StoryObj<typeof SkipWorkoutModal> = {
  render: () => (
    <div className="bg-accent/20 flex h-[600px] w-full items-center justify-center p-8">
      <SkipWorkoutModal
        isOpen={true}
        onClose={() => console.log('Close')}
        onConfirm={(reason) => console.log('Confirm', reason)}
        isLoading={false}
      />
    </div>
  ),
};
