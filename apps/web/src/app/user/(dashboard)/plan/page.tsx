'use client';

import { AlertCircle, PauseCircle } from 'lucide-react';
import { fitnessPlan, workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Button } from '@/lib/components';
import ModernDashboardLayout from './_components/modern-dashboard-layout';
import PlanOverview from './_components/plan-overview';
import QuickActions from './_components/quick-actions';
import WeeklySchedule from './_components/weekly-schedule';
import PlanOnboarding from './_components/plan-onboarding';
import PlanPreview from './_components/plan-preview';
import { ROUTES } from '@/lib/constants';

export default function PlanClient() {
  const activePlanQuery = fitnessPlan.useActivePlan();
  const upcomingWorkoutsQuery = workouts.useUpcomingWorkouts({ query: {} });

  const generatePlanMutation = fitnessPlan.useGeneratePlan();
  const activatePlanMutation = fitnessPlan.useActivatePlan();
  const pausePlanMutation = fitnessPlan.usePausePlan();

  const activePlanData = activePlanQuery.data;
  const isLoading = activePlanQuery.isLoading || upcomingWorkoutsQuery.isLoading;
  const error = activePlanQuery.error || upcomingWorkoutsQuery.error;

  // Use mutation data instead of local state
  const generatedPlan = generatePlanMutation.data;

  const handleGeneratePlan = async (request: fitnessPlan.GeneratePlanRequest) => {
    await generatePlanMutation.mutateAsync(request);
  };

  const handleActivatePlan = async (request: fitnessPlan.ActivatePlanRequest) => {
    await activatePlanMutation.mutateAsync(request);
    // Reset the generated plan by resetting the mutation
    generatePlanMutation.reset();
  };

  const handlePausePlan = async () => {
    if (activePlanData?.plan?.id) {
      await pausePlanMutation.mutateAsync({ json: { planId: activePlanData.plan.id } });
    }
  };

  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading your plan..." />;
  }

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

  if (generatedPlan) {
    return (
      <PlanPreview
        planData={generatedPlan}
        onActivate={(planId) => handleActivatePlan({ json: { planId } })}
        onCancel={() => setGeneratedPlan(null)}
        isLoading={activatePlanMutation.isPending}
      />
    );
  }

  if (!activePlanData?.hasPlan || !activePlanData.plan) {
    return (
      <PlanOnboarding
        onGenerate={handleGeneratePlan}
        onBrowse={() => {
          // TODO: Implement program browsing feature
        }}
        isLoading={generatePlanMutation.isPending}
      />
    );
  }

  const { plan } = activePlanData;

  if (plan.status === 'paused') {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20">
          <PauseCircle size={48} />
        </div>
        <h1 className="text-foreground mb-4 text-3xl font-bold">Plan Paused</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          Your training plan is currently on hold. Would you like to resume your journey?
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => handleActivatePlan({ json: { planId: plan.id } })}
            isLoading={activatePlanMutation.isPending}
            size="lg"
            className="rounded-2xl px-8"
          >
            Resume Training
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Implement plan archival
            }}
            size="lg"
            className="rounded-2xl px-8"
          >
            End Program
          </Button>
        </div>
      </div>
    );
  }

  if (plan.status === 'completed') {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 text-green-500 ring-1 ring-green-500/20">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-foreground mb-4 text-3xl font-bold">Goal Achieved!</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          Congratulations! You&apos;ve completed your program. Ready for the next challenge?
        </p>
        <Button
          onClick={() =>
            handleGeneratePlan({
              json: {
                goals: {
                  primary: 'maintenance',
                  secondary: ['hypertrophy'],
                  targetMetrics: { totalWorkouts: 20 },
                },
              },
            })
          }
          isLoading={generatePlanMutation.isPending}
          size="lg"
          className="shadow-primary/20 rounded-2xl px-8 shadow-lg"
        >
          Start New Program
        </Button>
      </div>
    );
  }

  const renderOverview = () => (
    <PlanOverview
      currentPlan={plan}
      onEditPlan={(id) => {
        // TODO: Implement plan editing
      }}
    />
  );

  const renderSchedule = () => (
    <WeeklySchedule
      plan={plan}
      onWorkoutClick={(id) => {
        // TODO: Navigate to workout detail page
      }}
    />
  );

  const renderActions = () => (
    <QuickActions
      onCreatePlan={() => setGeneratedPlan(null)}
      onSavePlan={() => {
        // TODO: Implement plan saving/bookmarking
      }}
      onExportPlan={() => {
        // TODO: Implement plan export (PDF/JSON)
      }}
      onPausePlan={handlePausePlan}
      isLoading={pausePlanMutation.isPending}
    />
  );

  return (
    <ModernDashboardLayout
      overview={renderOverview()}
      schedule={renderSchedule()}
      actions={renderActions()}
    />
  );
}
