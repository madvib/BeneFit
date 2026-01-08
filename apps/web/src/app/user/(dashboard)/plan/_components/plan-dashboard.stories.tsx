import type { Meta, StoryObj } from '@storybook/react';
import PlanOverview from './plan-overview';
import WeeklySchedule from './weekly-schedule';

// Mock Data
const MOCK_ACTIVE_PLAN = {
  id: 'plan_123',
  title: 'Strength & Conditioning',
  description: 'A 12-week program focused on compound movements and aerobic capacity.',
  status: 'active' as const,
  currentWeek: 3,
  durationWeeks: 12,
  summary: {
    completed: 8,
    total: 48,
    streak: 3,
  },
  weeks: [
    {
      weekNumber: 3,
      workouts: [
        {
          id: 'w1',
          dayOfWeek: 1, // Mon
          type: 'Strength',
          status: 'completed' as const,
          durationMinutes: 60,
        },
        {
          id: 'w2',
          dayOfWeek: 3, // Wed
          type: 'Cardio',
          status: 'pending' as const,
          durationMinutes: 45,
        },
        {
          id: 'w3',
          dayOfWeek: 5, // Fri
          type: 'HIIT',
          status: 'pending' as const,
          durationMinutes: 30,
        },
      ],
    },
  ],
};

const meta: Meta = {
  title: 'Pages/Dashboard/Plan',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const OverviewActive: StoryObj<typeof PlanOverview> = {
  render: () => (
    <div className="max-w-2xl">
      <PlanOverview
        currentPlan={MOCK_ACTIVE_PLAN}
        onEditPlan={() => alert('Edit Plan Clicked')}
      />
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
        plan={MOCK_ACTIVE_PLAN}
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
        <PlanOverview currentPlan={MOCK_ACTIVE_PLAN} onEditPlan={() => {}} />
        {/* Placeholder for other widget like Stats */}
        <div className="border-muted bg-accent/5 flex h-full items-center justify-center rounded-3xl border border-dashed p-8">
          <span className="text-muted-foreground">Stats Widget Placeholder</span>
        </div>
      </div>
      <WeeklySchedule plan={MOCK_ACTIVE_PLAN} onWorkoutClick={() => {}} />
    </div>
  ),
};
