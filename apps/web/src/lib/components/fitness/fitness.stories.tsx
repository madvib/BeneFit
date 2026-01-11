import type { Meta, StoryObj } from '@storybook/react';
import {
  mockUserStats,
  mockWorkoutHistory,
  mockCompletedWorkout,
  mockTrainingConstraints,
} from '../../testing/fixtures';
import {
  StatisticsSection,
  ProgressChart,
  ActivityFeed,
  WorkoutSummary,
  WorkoutList,
  PrimaryGoalGrid,
  CategorizedEquipmentSelection,
  PlanGenerationStepper,
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

export const RecentActivity: StoryObj = {
  render: () => (
    <div className="max-w-2xl">
      <ActivityFeed />
    </div>
  ),
};

export const Summary: StoryObj<typeof WorkoutSummary> = {
  render: () => (
    <div className="max-w-2xl">
      <WorkoutSummary workout={mockCompletedWorkout as any} />
    </div>
  ),
};

export const HistoryList: StoryObj<typeof WorkoutList> = {
  render: () => (
    <div className="max-w-4xl">
      <WorkoutList workouts={mockWorkoutHistory.workouts as any} />
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
    <div className="bg-background mx-auto max-w-2xl overflow-hidden rounded-2xl border shadow-xl">
      <PlanGenerationStepper onComplete={(p) => console.log(p)} onSkip={() => {}} />
    </div>
  ),
};
