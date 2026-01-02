'use client';

import { fitnessPlan, workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import ModernDashboardLayout from './#components/modern-dashboard-layout';
import PlanOverview from './#components/plan-overview';
import QuickActions from './#components/quick-actions';
import WeeklySchedule from './#components/weekly-schedule';
import { ROUTES } from '@/lib/constants';

export default function PlanClient() {
  const activePlanQuery = fitnessPlan.useActivePlan();
  const upcomingWorkoutsQuery = workouts.useUpcomingWorkouts({});

  // Mutations
  const generatePlanMutation = fitnessPlan.useGeneratePlan();
  const activatePlanMutation = fitnessPlan.useActivatePlan();

  const activePlanData = activePlanQuery.data;
  const upcomingWorkouts = upcomingWorkoutsQuery.data;
  const isLoading = activePlanQuery.isLoading || upcomingWorkoutsQuery.isLoading;
  const error = activePlanQuery.error || upcomingWorkoutsQuery.error;

  const handleGeneratePlan = async (request: fitnessPlan.GeneratePlanRequest) => {
    await generatePlanMutation.mutateAsync(request);
  };

  const handleActivatePlan = async (request: fitnessPlan.ActivatePlanRequest) => {
    await activatePlanMutation.mutateAsync(request);
  };

  // --- Loading State ---
  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading your plan..." />;
  }

  // --- Error State ---
  if (error) {
    return (
      <ErrorPage
        title="Plan Loading Error"
        message="Unable to load your workout plan."
        error={error}
        backHref={ROUTES.HOME}
      />
    );
  }

  // --- No Plan State ---
  if (!activePlanData?.hasPlan || !activePlanData.plan) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
        <h1 className="text-foreground mb-4 text-3xl font-bold">No Active Plan</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {activePlanData?.message ||
            'Create a fitness plan to get started with your training journey!'}
        </p>
        <button
          onClick={() => console.log('TODO: Open plan generation modal')}
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-bold transition-transform hover:scale-105"
        >
          Generate Plan
        </button>
      </div>
    );
  }

  const { plan } = activePlanData;

  // --- View Components ---
  const renderOverview = () => (
    <PlanOverview currentPlan={plan} onEditPlan={(id) => console.log('Edit plan:', id)} />
  );

  const renderSchedule = () => (
    <WeeklySchedule plan={plan} onWorkoutClick={(id) => console.log('Workout clicked:', id)} />
  );

  const renderActions = () => (
    <QuickActions
      onCreatePlan={() => console.log('Create plan')}
      onSavePlan={() => console.log('Save plan')}
      onExportPlan={() => console.log('Export plan')}
    />
  );

  // --- Layout ---
  return (
    <ModernDashboardLayout
      overview={renderOverview()}
      schedule={renderSchedule()}
      actions={renderActions()}
    />
  );
}
