import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { workoutScenarios, fitnessPlanScenarios } from '@bene/react-api-client/test';
import { Carousel, WorkoutDetailSheet } from '@/lib/components';
import { PlanOverview, QuickActions, WeeklySchedule, PlanOnboarding, PlanPreview } from './index';
import { useActivePlan, useGeneratePlan, useTodaysWorkout } from '@bene/react-api-client';
import PlanPage from '../page';

const meta: Meta = {
  title: 'Features/Fitness Plan',
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        ...fitnessPlanScenarios.default,
        ...workoutScenarios.default,
      ],
    },
  },
};

export default meta;

/**
 * The full page story now uses the actual Page component.
 * Data is fetched via hooks and mocked by MSW.
 * No 'any' casts needed as hooks return correct types.
 */
export const FullPage: StoryObj = {
  render: () => <PlanPage />,
};

export const LoadingState: StoryObj = {
  parameters: {
    msw: {
      handlers: [...fitnessPlanScenarios.loading],
    },
  },
  render: () => <PlanPage />,
};

export const ErrorState: StoryObj = {
  parameters: {
    msw: {
      handlers: [...fitnessPlanScenarios.error],
    },
  },
  render: () => <PlanPage />,
};

export const EmptyStatePage: StoryObj = {
  parameters: {
    msw: {
      handlers: [...fitnessPlanScenarios.noActivePlan],
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
          <PlanOverview currentPlan={data?.plan ?? null} onEditPlan={() => alert('Edit Plan Clicked')} />
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
    const { data } = useActivePlan();
    const [selectedWeek, setSelectedWeek] = useState(1);
    
    if (!data?.plan) return <div>Loading schedule...</div>;

    return (
      <div className="max-w-4xl p-6">
        <WeeklySchedule
          plan={data.plan}
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
  )
};

export const Onboarding: StoryObj = {
  render: () => (
    <div className="h-screen w-full bg-background p-6">
      <PlanOnboarding 
        onGenerate={async () => new Promise(resolve => setTimeout(resolve, 2000))} 
        onBrowse={() => {}}
        isLoading={false}
      />
    </div>
  )
};

export const WorkoutDetailModalStory: StoryObj = {
  name: 'Workout Detail Sheet',
  render: () => {
    const { data } = useTodaysWorkout();
    return (
      <WorkoutDetailSheet 
        workout={data?.workout ?? null} 
        open={true} 
        onOpenChange={() => {}} 
      />
    );
  },
};

export const PlanPreviewStory: StoryObj = {
  name: 'Plan Preview',
  render: () => {
    const generatePlan = useGeneratePlan();
    const data = generatePlan.data;

    // Use a button to trigger the mock generation if no data is present
    if (!data) {
      return (
        <div className="p-12 flex flex-col items-center gap-4">
          <p>This story simulates the generation flow. Click below to mock a plan preview.</p>
          <button 
            onClick={() => generatePlan.mutate({ json: { goals: { primary: 'strength' } } })}
            className="px-4 py-2 bg-primary text-white rounded-xl"
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

