import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { AlertCircle, PauseCircle } from 'lucide-react';
import { useActivePlan, useUpcomingWorkouts, useGeneratePlan, useActivatePlan, usePausePlan, GeneratePlanRequest, ActivatePlanRequest } from '@bene/react-api-client';
import {
  LoadingSpinner,
  ErrorPage,
  Button,
  DashboardShell,
  typography,
  IconBox,
} from '@/lib/components';
import {
  PlanOverview,
  QuickActions,
  WeeklySchedule,
  PlanOnboarding,
  PlanPreview,
} from './-components/plan';
import { ScheduledWorkoutView } from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export const Route = createFileRoute('/$user/_dashboard/plan')({
  component: PlanClient,
});

function PlanClient() {
  const activePlanQuery = useActivePlan();
  const upcomingWorkoutsQuery = useUpcomingWorkouts({ query: {} });

  const generatePlanMutation = useGeneratePlan();
  const activatePlanMutation = useActivatePlan();
  const pausePlanMutation = usePausePlan();

  const activePlanData = activePlanQuery.data;
  const isLoading = activePlanQuery.isLoading || upcomingWorkoutsQuery.isLoading;
  const error = activePlanQuery.error || upcomingWorkoutsQuery.error;

  // Use mutation data instead of local state
  const generatedPlan = generatePlanMutation.data;

  // New State for Week Navigation and Details
  const [selectedWeek, setSelectedWeek] = React.useState<number>(1);
  const [selectedWorkoutId, setSelectedWorkoutId] = React.useState<string | null>(null);
  const [showNewProgramFlow, setShowNewProgramFlow] = React.useState(false);

  // Sync selected week with current week when plan loads
  React.useEffect(() => {
    if (activePlanData?.plan?.currentWeek) {
      const weekNumber = activePlanData.plan.currentWeek?.weekNumber || 1;
        
      setSelectedWeek(weekNumber);
    }
  }, [activePlanData?.plan?.currentWeek]);

  const handleGeneratePlan = async (request: GeneratePlanRequest) => {
    await generatePlanMutation.mutateAsync(request);
  };

  const handleActivatePlan = async (request: ActivatePlanRequest) => {
    await activatePlanMutation.mutateAsync(request);
    // Reset the generated plan by resetting the mutation
    generatePlanMutation.reset();
    setShowNewProgramFlow(false);
  };

  const handlePausePlan = async () => {
    if (activePlanData?.plan?.id) {
      await pausePlanMutation.mutateAsync({ json: { planId: activePlanData.plan.id } });
    }
  };
  const currentPlan = activePlanData?.plan;

  const selectedWorkout = React.useMemo(() => {
    if (!selectedWorkoutId || !currentPlan?.weeks) return null;

    return (
      currentPlan.weeks
        .flatMap((week) => week.workouts)
        .find((workout) => workout.id === selectedWorkoutId) ?? null
    );
  }, [currentPlan, selectedWorkoutId]);

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
        onCancel={() => generatePlanMutation.reset()}
        isLoading={activatePlanMutation.isPending}
      />
    );
  }

  if (!activePlanData?.plan || showNewProgramFlow) {
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

  // Handlers for modal actions
  // TODO: Hooks for Start/Skip are missing in this file, need to add them

  if (plan.status === 'paused') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <IconBox
          icon={PauseCircle}
          variant="ghost"
          size="xl"
          className="mb-6 rounded-3xl bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20"
        />
        <h1 className={`${typography.h1} mb-4`}>Plan Paused</h1>
        <p className={`${typography.lead} text-muted-foreground mb-8 max-w-md`}>
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
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <IconBox
          icon={AlertCircle}
          variant="ghost"
          size="xl"
          className="mb-6 rounded-3xl bg-green-500/10 text-green-500 ring-1 ring-green-500/20"
        />
        <h1 className={`${typography.h1} mb-4`}>Goal Achieved!</h1>
        <p className={`${typography.lead} text-muted-foreground mb-8 max-w-md`}>
          Congratulations! You&apos;ve completed your program. Ready for the next challenge?
        </p>
        <Button
          onClick={() => setShowNewProgramFlow(true)}
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
      onEditPlan={(_id) => {
        // TODO: Implement plan editing
      }}
    />
  );

  const renderSchedule = () => (
    <WeeklySchedule
      plan={plan}
      selectedWeek={selectedWeek}
      onWeekChange={setSelectedWeek}
      onWorkoutClick={(id) => setSelectedWorkoutId(id)}
    />
  );

  const renderActions = () => (
    <QuickActions
      onCreatePlan={() => generatePlanMutation.reset()}
      onSavePlan={() => {
        // TODO: Implement plan saving/bookmarking
      }}
      onExportPlan={() => {
        // TODO: Implement plan export (PDF/JSON}`
      }}
      onPausePlan={handlePausePlan}
      isLoading={pausePlanMutation.isPending}
    />
  );

  return (
    <>
      <DashboardShell
        overview={renderOverview()}
        schedule={renderSchedule()}
        actions={renderActions()}
      />

      {selectedWorkout && (
        <ScheduledWorkoutView
          isOpen={!!selectedWorkoutId}
          onClose={() => setSelectedWorkoutId(null)}
          workout={selectedWorkout as any}
          layout="modal"
          onStart={() => {
            if (selectedWorkoutId) {
              globalThis.location.href = `/user/session/${selectedWorkoutId}`;
            }
          }}
          onSkip={() => {
            if (selectedWorkoutId) {
              console.log('Skipping workout', selectedWorkoutId);
            }
          }}
        />
      )}
    </>
  );
}
