import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as fixtures from '@bene/react-api-client/fixtures';
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


// TODO we need CLEAR workout types. TEMPLATE, UPCOMING, COMPLETED
const mockTemplateResult = fixtures.buildGetTodaysWorkoutResponse(undefined, { seed: 102 });
const mockWorkoutTemplate = mockTemplateResult.isSuccess ? (mockTemplateResult.value.workout ?? null) : null;


const meta: Meta = {
  title: 'Components/Fitness/Workouts',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const WorkoutDisplay: StoryObj = {
  name: 'Workout Display',
  render: () => {
    if (!mockWorkoutTemplate) return <div>No workout data available</div>;
    return (
      <div className="max-w-2xl">
        <WorkoutSummary workout={mockWorkoutTemplate} />
      </div>
    );
  },
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
  render: () => {
    if (!mockWorkoutTemplate) return <div>No workout data</div>;
    return (
      <div className="max-w-md p-4">
        <PerformanceForm
          workout={mockWorkoutTemplate}
          onSubmit={(data) => console.log('Submit', data)}
          isLoading={false}
        />
      </div>
    );
  },
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

