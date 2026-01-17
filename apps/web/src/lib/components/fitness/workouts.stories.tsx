import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { getActivityStatusConfig } from '@/lib/constants/training-ui';
import { Badge } from '@/lib/components';
import { typography } from '../theme/typography/typography';
import {
  WorkoutSummary,
  SkipWorkoutModal,
  RPEPicker,
  WorkoutDetailSheet,
  PerformanceForm,
} from './index';

import { fixtures } from '@bene/react-api-client';

// Generate consistent workout data using fixtures
const mockWorkoutResponse = fixtures.createGetUpcomingWorkoutsResponse(undefined, { seed: 100 });
const baseWorkout = mockWorkoutResponse.workouts[0];

// Adapt fixture to UI Model
const mockDailyWorkout = {
  id: baseWorkout.workoutId,
  date: '2026-01-16',
  title: 'Upper Body Power', // Not in fixture, manual add
  type: baseWorkout.type as any,
  status: baseWorkout.status as any,
  duration: baseWorkout.durationMinutes,
  activities: [ // Not in fixture, manual add for UI
      { 
        type: 'main', 
        durationMinutes: 15 
      },
       { 
        type: 'cooldown', 
        durationMinutes: 5 
      }
  ],
  exercises: [
    { name: 'Bench Press', sets: 4, reps: 5, weight: 100 },
    { name: 'Overhead Press', sets: 3, reps: 8, weight: 60 },
  ],
} as any;

const mockWorkoutTemplate = {
  id: 'template-1',
  weekNumber: 1,
  dayOfWeek: 1,
  scheduledDate: '2026-01-16',
  title: 'Upper Body Strength',
  type: 'strength',
  category: 'strength' as const,
  goals: {
    volume: {
      totalSets: 12,
      totalReps: 60,
      targetWeight: 'moderate' as const,
    },
    completionCriteria: {
      mustComplete: true,
      minimumEffort: 80,
      autoVerifiable: false,
    },
  },
  activities: [
    {
      name: 'Bench Press',
      type: 'main' as const,
      order: 1,
      structure: {
        exercises: [
          {
            name: 'Bench Press',
            sets: 4,
            reps: 8,
            weight: 100,
            rest: 120,
          },
        ],
      },
    },
  ],
  status: 'scheduled' as const,
  importance: 'key' as const,
};

const meta: Meta = {
  title: 'Components/Fitness/Workouts',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const WorkoutDisplay: StoryObj = {
  name: 'Workout Display',
  render: () => (
    <div className="max-w-2xl">
      <WorkoutSummary workout={mockDailyWorkout} />
    </div>
  ),
};

export const SkipModal: StoryObj<typeof SkipWorkoutModal> = {
  name: 'Skip Workout Modal',
  render: () => (
    <div className="bg-accent/20 flex h-150 w-full items-center justify-center p-8">
      <SkipWorkoutModal
        isOpen={true}
        onClose={() => console.log('Close')}
        onConfirm={(reason) => console.log('Confirm', reason)}
        isLoading={false}
      />
    </div>
  ),
};

export const WorkoutDetailSheetStory: StoryObj<typeof WorkoutDetailSheet> = {
  name: 'Workout Detail Sheet',
  render: () => (
    <WorkoutDetailSheet
      workout={mockWorkoutTemplate}
      open={true}
      onOpenChange={() => console.log('Open Change')}
    />
  ),
};

export const PerformanceFormStory: StoryObj<typeof PerformanceForm> = {
  name: 'Performance Form',
  render: () => (
    <div className="max-w-md p-4">
      <PerformanceForm
        workout={mockDailyWorkout}
        onSubmit={(data) => console.log('Submit', data)}
        isLoading={false}
      />
    </div>
  ),
};

export const Badges: StoryObj = {
  render: () => {
    const statuses = ['completed', 'skipped', 'missed', 'scheduled'];
    return (
      <div className="flex gap-4 p-6">
        {statuses.map((status) => {
          const config = getActivityStatusConfig(status);
          return (
            <Badge key={status} variant={config.variant}>
              {config.label}
            </Badge>
          );
        })}
      </div>
    );
  },
};

export const RpeSelection: StoryObj = {
  render: function Render() {
    const [value, setValue] = React.useState(7);
    return (
      <div className="max-w-md p-6">
        <RPEPicker value={value} onChange={setValue} />
        <div className={`${typography.small} ${typography.muted} mt-4 text-center`}>
          Current Value: {value}
        </div>
      </div>
    );
  },
};

