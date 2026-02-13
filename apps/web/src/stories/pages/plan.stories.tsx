import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  workoutScenarios,
  fitnessPlanScenarios,
  profileScenarios,
} from '@bene/react-api-client/test';
import { Carousel, LoadingSpinner, ScheduledWorkoutView } from '@/lib/components';
import { useActivePlan, useGeneratePlan, useTodaysWorkout } from '@bene/react-api-client';

import {
  PlanOverview,
  QuickActions,
  WeeklySchedule,
  PlanOnboarding,
  PlanPreview,
} from '@/routes/$user/_dashboard/-components/plan';

import { Route } from '@/routes/$user/_dashboard/plan';

const PlanPage = Route.options.component!;

const meta: Meta<typeof PlanPage> = {
  title: 'Pages/Fitness Plan',
  component: PlanPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        ...fitnessPlanScenarios.default,
        ...workoutScenarios.default,
        ...profileScenarios.default,
      ],
    },
  },
};

export default meta;

export const FullPage: StoryObj<typeof PlanPage> = {
  render: () => <PlanPage />,
};

export const LoadingState: StoryObj<typeof PlanPage> = {
  parameters: {
    msw: {
      handlers: [...fitnessPlanScenarios.loading, ...profileScenarios.default],
    },
  },
  render: () => <PlanPage />,
};

export const ErrorState: StoryObj<typeof PlanPage> = {
  parameters: {
    msw: {
      handlers: [...fitnessPlanScenarios.error, ...profileScenarios.default],
    },
  },
  render: () => <PlanPage />,
};

export const EmptyStatePage: StoryObj<typeof PlanPage> = {
  parameters: {
    msw: {
      handlers: [...fitnessPlanScenarios.noActivePlan, ...profileScenarios.default],
    },
  },
  render: () => <PlanPage />,
};

export const PlanOverviewShowcase: StoryObj = {
  name: 'Plan Overview Showcase',
  render: () => {
    const { data } = useActivePlan();
    return (
      <Carousel>
        {/* Active Plan */}
        <div className="max-w-2xl p-6">
          <PlanOverview
            currentPlan={data?.plan ?? null}
            onEditPlan={() => alert('Edit Plan Clicked')}
          />
        </div>
        {/* Empty State */}
        <div className="h-[400px] max-w-2xl p-6">
          <PlanOverview currentPlan={null} onEditPlan={() => {}} />
        </div>
      </Carousel>
    );
  },
};

export const WeeklyScheduleInteractive: StoryObj = {
  name: 'Weekly Schedule Interactive',
  render: () => {
    const { data, isLoading } = useActivePlan();
    const [selectedWeek, setSelectedWeek] = useState(1);

    if (isLoading) return <LoadingSpinner variant="screen" text="Loading schedule..." />;

    return (
      <div className="max-w-4xl p-6">
        <WeeklySchedule
          plan={data?.plan}
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
          onWorkoutClick={(id) => alert(`Workout ${id} clicked`)}
        />
      </div>
    );
  },
};

export const QuickActionsBar: StoryObj = {
  render: () => (
    <div className="p-6">
      <QuickActions
        onCreatePlan={() => {}}
        onSavePlan={() => {}}
        onExportPlan={() => {}}
        onPausePlan={() => {}}
        isLoading={false}
      />
    </div>
  ),
};

// PlanOnboarding content
export const Onboarding: StoryObj = {
  render: () => (
    <div className="bg-background h-screen w-full p-6">
      {/* Use the imported PlanOnboarding component. Warning: check if it exists in expected path */}
      <PlanOnboarding
        onGenerate={async () => new Promise((resolve) => setTimeout(resolve, 2000))}
        onBrowse={() => {}}
        isLoading={false}
      />
    </div>
  ),
};

export const WorkoutDetailModalStory: StoryObj = {
  name: 'Workout Detail Modal',
  render: () => {
    const { data } = useTodaysWorkout();
    return (
      <ScheduledWorkoutView
        workout={data?.workout}
        layout="modal"
        isOpen={true}
        onClose={() => {}}
      />
    );
  },
};

export const PlanPreviewStory: StoryObj = {
  name: 'Plan Preview',
  render: () => {
    const generatePlan = useGeneratePlan();
    const data = generatePlan.data;

    if (!data) {
      return (
        <div className="flex flex-col items-center gap-4 p-12">
          <p>This story simulates the generation flow. Click below to mock a plan preview.</p>
          <button
            onClick={() => generatePlan.mutate({ json: { goals: { primary: 'strength' } } })}
            className="bg-primary rounded-xl px-4 py-2 text-white"
            disabled={generatePlan.isPending}
          >
            {generatePlan.isPending ? 'Generating...' : 'Mock Generation'}
          </button>
        </div>
      );
    }

    return (
      <div className="bg-background min-h-screen">
        <PlanPreview
          planData={data}
          onActivate={(id) => console.log('Activate', id)}
          onCancel={() => generatePlan.reset()}
          isLoading={false}
        />
      </div>
    );
  },
};
