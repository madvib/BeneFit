import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { mockActivePlan, mockWorkoutTemplate } from '@/lib/testing/fixtures';
import { Carousel, DashboardShell, WorkoutDetailSheet } from '@/lib/components';
import{ PlanOverview, QuickActions, WeeklySchedule,PlanOnboarding,PlanPreview} from './index';

// PlanOverview expects the plan object, not the full response
const activePlan = mockActivePlan.plan!;

const meta: Meta = {
  title: 'Features/Fitness Plan',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const FullDashboardSimulator = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  // Derive selected workout from plan
  const selectedWorkout = activePlan.weeks
    .flatMap(w => w.workouts)
    .find(w => w.id === selectedWorkoutId);

  // Mock template from the selected workout ID (just using a single fixture for demo)
  // In a real app we'd fetch the specific template. Here we just fallback to the mock if found.
  const workoutDetail = selectedWorkout ? { ...mockWorkoutTemplate, id: selectedWorkout.id } : null;

  return (
    <>
      <DashboardShell
        overview={
          <PlanOverview 
            currentPlan={activePlan} 
            onEditPlan={() => alert('Edit Plan')} 
          />
        }
        schedule={
          <WeeklySchedule
            plan={activePlan}
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
            onWorkoutClick={setSelectedWorkoutId}
          />
        }
        actions={
          <QuickActions
            onCreatePlan={() => console.log('Create')}
            onSavePlan={() => console.log('Save')}
            onExportPlan={() => console.log('Export')}
            onPausePlan={() => console.log('Pause')}
            isLoading={false}
          />
        }
      />
      
      {/* 
        Note: The real page uses WorkoutDetailModal which wraps WorkoutDetailSheet.
        We use the sheet directly here or the modal if exported 
      */}
      <WorkoutDetailSheet 
        workout={workoutDetail} 
        open={!!selectedWorkoutId} 
        onOpenChange={(open) => !open && setSelectedWorkoutId(null)} 
      />
    </>
  );
};

export const FullPage: StoryObj = {
  render: () => <FullDashboardSimulator />,
};

export const PlanOverviewShowcase: StoryObj = {
  name: 'Plan Overview Showcase',
  render: () => (
    <Carousel>
      {/* Active Plan */}
      <div className="max-w-2xl p-6">
        <PlanOverview currentPlan={activePlan} onEditPlan={() => alert('Edit Plan Clicked')} />
      </div>
      {/* Empty State */}
      <div className="h-[400px] max-w-2xl p-6">
        <PlanOverview currentPlan={null} onEditPlan={() => {}} />
      </div>
    </Carousel>
  ),
};

export const WeeklyScheduleInteractive: StoryObj = {
  name: 'Weekly Schedule Interactive',
  render: () => (
    <div className="max-w-4xl p-6">
      <WeeklySchedule
        plan={activePlan}
        selectedWeek={1}
        onWeekChange={(week) => console.log('Week changed', week)}
        onWorkoutClick={(id) => alert(`Workout ${id} clicked`)}
      />
    </div>
  ),
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

export const WorkoutDetailModalStory: StoryObj<typeof WorkoutDetailSheet> = {
  name: 'Workout Detail Sheet',
  render: () => (
    <WorkoutDetailSheet workout={mockWorkoutTemplate} open={true} onOpenChange={() => {}} />
  ),
};

export const PlanPreviewStory: StoryObj = {
  name: 'Plan Preview',
  render: () => {
    const mockPreviewData = {
      planId: 'generated-plan-123',
      name: 'Strength & Hypertrophy',
      durationWeeks: 8,
      workoutsPerWeek: 4,
      preview: {
        weekNumber: 1,
        workouts: [
          { day: 'Mon', summary: 'Upper Body Power', type: 'strength' },
          { day: 'Tue', summary: 'Lower Body Hypertrophy', type: 'hypertrophy' },
          { day: 'Thu', summary: 'Active Recovery', type: 'cardio' },
          { day: 'Fri', summary: 'Full Body Circuit', type: 'conditioning' },
        ],
      },
    };

    return (
      <div className="bg-background min-h-screen">
        <PlanPreview
          planData={mockPreviewData}
          onActivate={(id) => console.log('Activate', id)}
          onCancel={() => console.log('Cancel')}
          isLoading={false}
        />
      </div>
    );
  },
};
