import type { Meta, StoryObj } from '@storybook/react';
import PlanOverview from './plan-overview';
import WeeklySchedule from './weekly-schedule';
import { WorkoutDetailSheet } from './workout-detail-sheet';
import QuickActions from './quick-actions';
import { mockActivePlan } from '@/lib/testing/fixtures';
import { mockWorkoutTemplate } from '@/lib/testing/fixtures/workouts';

// PlanOverview likely expects the plan object, not the full response
const activePlan = mockActivePlan.plan!;

const meta: Meta = {
  title: 'Features/Planning/Dashboard',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const OverviewActive: StoryObj<typeof PlanOverview> = {
  render: () => (
    <div className="max-w-2xl">
      <PlanOverview currentPlan={activePlan} onEditPlan={() => alert('Edit Plan Clicked')} />
    </div>
  ),
};

export const OverviewEmpty: StoryObj<typeof PlanOverview> = {
  render: () => (
    <div className="h-[400px] max-w-2xl">
      <PlanOverview currentPlan={null} onEditPlan={() => {}} />
    </div>
  ),
};

export const WeeklyScheduleView: StoryObj<typeof WeeklySchedule> = {
  render: () => (
    <div className="max-w-4xl">
      <WeeklySchedule
        plan={activePlan}
        selectedWeek={1}
        onWeekChange={(week) => console.log('Week changed', week)}
        onWorkoutClick={(id) => alert(`Workout ${id} clicked`)}
      />
    </div>
  ),
};

export const DashboardView: StoryObj = {
  name: 'Full Dashboard (Composed)',
  render: () => (
    <div className="max-w-5xl space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <PlanOverview currentPlan={activePlan} onEditPlan={() => {}} />
        {/* Placeholder for other widget like Stats */}
        <div className="border-muted bg-accent/5 flex h-full items-center justify-center rounded-3xl border border-dashed p-8">
          <span className="text-muted-foreground">Stats Widget Placeholder</span>
        </div>
      </div>
      <WeeklySchedule
        plan={activePlan}
        selectedWeek={1}
        onWeekChange={() => {}}
        onWorkoutClick={() => {}}
      />
    </div>
  ),
};

// --- Consolidated Sub-Components ---

export const WorkoutDetail: StoryObj<typeof WorkoutDetailSheet> = {
  render: () => (
    <WorkoutDetailSheet workout={mockWorkoutTemplate} open={true} onOpenChange={() => {}} />
  ),
};

export const PlanActions: StoryObj<typeof QuickActions> = {
  render: () => (
    <div className="max-w-md p-4">
      <QuickActions
        onCreatePlan={() => {}}
        onSavePlan={() => {}}
        onExportPlan={() => {}}
        isLoading={false}
        onPausePlan={() => {}}
      />
    </div>
  ),
};
