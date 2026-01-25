import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as fixtures from '@bene/react-api-client/fixtures';
import { getActivityStatusConfig } from '@/lib/constants';
import { Badge } from '@/lib/components';
import {  ScheduledWorkoutView, CompletedWorkoutView, RPEPicker, SkipWorkoutModal } from './index';
import { typography } from '../theme/typography/typography';

// --- PURE FIXTURE DATA ---
// We use high-fidelity fixtures directly from the API client to avoid hardcoded boilerplate.
const todayWorkout = fixtures.buildGetTodaysWorkoutResponse({ success: true, seed: 101 }).value?.workout;
const historyData = fixtures.buildGetWorkoutHistoryResponse({ seed: 202 }).value;
const completedWorkout = historyData?.workouts?.[0];

const meta: Meta = {
  title: 'Components/Fitness/Workouts',
  parameters: {
    layout: 'padded',
  },
  decorators: [(Story) => <div className="bg-background min-h-screen p-8"><Story /></div>],
};

export default meta;

// --- SCHEDULED STORIES ---

export const ScheduledDashboard: StoryObj<typeof ScheduledWorkoutView> = {
  name: 'Scheduled / Dashboard',
  render: (args) => <ScheduledWorkoutView {...args} />,
  args: {
    workout: todayWorkout!,
    onStart: () => alert('Start Session'),
    onSkip: () => alert('Reschedule'),
    layout: 'dashboard',
  },
};

export const ScheduledModal: StoryObj<typeof ScheduledWorkoutView> = {
  name: 'Scheduled / Modal',
  render: (args) => <ScheduledWorkoutView {...args} />,
  args: {
    workout: todayWorkout!,
    onStart: () => alert('Start Session'),
    layout: 'modal',
    isOpen: true,
    onClose: () => alert('Close Modal'),
  },
};

export const ScheduledInline: StoryObj<typeof ScheduledWorkoutView> = {
  name: 'Scheduled / Inline',
  render: (args) => (
    <div className="max-w-[500px] mx-auto">
       <ScheduledWorkoutView {...args} />
    </div>
  ),
  args: {
    workout: todayWorkout!,
    onStart: () => alert('Start Session'),
    layout: 'inline',
  },
};

// --- COMPLETED STORIES ---

export const CompletedHistory: StoryObj<typeof CompletedWorkoutView> = {
  name: 'Completed / Dashboard',
  render: (args) => <CompletedWorkoutView {...args} />,
  args: {
    workout: completedWorkout!,
  },
};

export const CompletedModal: StoryObj<typeof CompletedWorkoutView> = {
  name: 'Completed / Modal',
  render: (args) => <CompletedWorkoutView {...args} />,
  args: {
    variant: 'modal',
    isOpen: true,
    onClose: () => alert('Close Modal'),
    workout: completedWorkout!,
  }
};

// --- UTILITY STORIES ---

export const SkipModal: StoryObj<typeof SkipWorkoutModal> = {
  name: 'Skip Workout Modal',
  render: () => (
    <div className="bg-accent/20 flex h-150 w-full items-center justify-center rounded-3xl p-8">
      <SkipWorkoutModal
        isOpen={true}
        onClose={() => console.log('Close')}
        onConfirm={(reason) => console.log('Confirm', reason)}
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
