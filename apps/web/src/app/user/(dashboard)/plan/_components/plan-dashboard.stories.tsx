import type { Meta, StoryObj } from '@storybook/react';
import PlanOverview from './plan-overview';
import WeeklySchedule from './weekly-schedule';
import { WorkoutDetailSheet } from './workout-detail-sheet';
import QuickActions from './quick-actions';
import GoalSelectionForm from './goal-selection-form';
import PlanSuggestions from './plan-suggestions';
import PlanOnboarding from './plan-onboarding';
import SuggestionsView from './suggestions-view';
import WorkoutDetailModal from './workout-detail-modal';
import { mockActivePlan, mockWorkoutTemplate } from '../../../../../lib/testing/fixtures';
import { Dumbbell, Activity } from 'lucide-react';

// PlanOverview likely expects the plan object, not the full response
const activePlan = mockActivePlan.plan!;

const meta: Meta = {
  title: 'Features/FitnessPlan',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const OverviewActive: StoryObj<typeof PlanOverview> = {
  render: () => (
    <div className="max-w-2xl p-6">
      <PlanOverview currentPlan={activePlan} onEditPlan={() => alert('Edit Plan Clicked')} />
    </div>
  ),
};

export const OverviewEmpty: StoryObj<typeof PlanOverview> = {
  render: () => (
    <div className="h-[400px] max-w-2xl p-6">
      <PlanOverview currentPlan={null} onEditPlan={() => {}} />
    </div>
  ),
};

export const WeeklyScheduleView: StoryObj<typeof WeeklySchedule> = {
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

export const DashboardView: StoryObj = {
  name: 'Full Dashboard (Composed)',
  render: () => (
    <div className="max-w-5xl space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <PlanOverview currentPlan={activePlan} onEditPlan={() => {}} />
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

const mockSuggestions = [
  {
    id: '1',
    title: 'Hypertrophy Focus',
    category: 'Muscle Building',
    rating: 4.8,
    duration: '12 Weeks',
    users: '2.5k',
    image: <Dumbbell />,
  },
  {
    id: '2',
    title: 'Fat Loss Accelerator',
    category: 'Weight Loss',
    rating: 4.6,
    duration: '8 Weeks',
    users: '5k',
    image: <Activity />,
  },
];

export const OnboardingHero: StoryObj<typeof PlanOnboarding> = {
  render: () => (
    <div className="bg-background min-h-screen">
      <PlanOnboarding onGenerate={() => {}} onBrowse={() => {}} isLoading={false} />
    </div>
  ),
};

export const GoalSelection: StoryObj<typeof GoalSelectionForm> = {
  render: () => (
    <div className="container mx-auto max-w-3xl p-6">
      <GoalSelectionForm onGenerate={(data) => console.log(data)} isLoading={false} />
    </div>
  ),
};

export const SuggestionsList: StoryObj<typeof PlanSuggestions> = {
  render: () => (
    <div className="max-w-4xl p-6">
      <PlanSuggestions
        suggestions={mockSuggestions}
        onSelectPlan={(id) => alert(`Selected ${id}`)}
      />
    </div>
  ),
};

export const SuggestionsViewFull: StoryObj<typeof SuggestionsView> = {
  render: () => (
    <div className="max-w-4xl">
      <SuggestionsView
        planSuggestions={[
          {
            id: '1',
            name: 'Hypertrophy Focus',
            difficulty: 'Intermediate',
            duration: '12 Weeks',
            category: 'Muscle Building',
          },
          {
            id: '2',
            name: 'Marathon Prep',
            difficulty: 'Advanced',
            duration: '16 Weeks',
            category: 'Endurance',
          },
        ]}
        onCreatePlan={() => {}}
        onSavePlan={() => {}}
        onExportPlan={() => {}}
      />
    </div>
  ),
};

export const WorkoutModal: StoryObj<typeof WorkoutDetailModal> = {
  render: () => (
    <WorkoutDetailModal
      isOpen={true}
      onClose={() => {}}
      workout={activePlan.weeks[1].workouts[2]} // Scheduled workout
      onStart={() => {}}
      onSkip={() => {}}
    />
  ),
};

export const WorkoutModalCompleted: StoryObj<typeof WorkoutDetailModal> = {
  render: () => (
    <WorkoutDetailModal
      isOpen={true}
      onClose={() => {}}
      workout={activePlan.weeks[0].workouts[0]} // Completed workout
      onStart={() => {}}
      onSkip={() => {}}
    />
  ),
};
