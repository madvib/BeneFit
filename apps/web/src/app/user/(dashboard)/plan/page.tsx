'use client';

import { usePlanController } from '@/controllers';
import { LoadingSpinner, ErrorPage } from '@/components';
import PlanOverview from '@/components/user/dashboard/plan/plan-overview';
import WeeklySchedule from '@/components/user/dashboard/plan/weekly-schedule';
import PlanSuggestions from '@/components/user/dashboard/plan/plan-suggestions';
import QuickActions from '@/components/user/dashboard/plan/quick-actions';
import ModernDashboardLayout from '@/components/user/dashboard/plan/modern-dashboard-layout';

export default function PlanClient() {
  const {
    currentPlan,
    weeklyWorkouts,
    planSuggestions,
    isLoading,
    error,
    handleEditPlan,
    handleCreatePlan,
  } = usePlanController();



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
        backHref="/"
      />
    );
  }

  // --- View Components ---
  const renderOverview = () => (
    <PlanOverview
      currentPlan={currentPlan}
      onEditPlan={handleEditPlan}
    />
  );

  const renderSchedule = () => (
    <WeeklySchedule weeklyWorkouts={weeklyWorkouts} onWorkoutClick={function (id: string): void {
      throw new Error('Function not implemented.');
    } } />
  );

  const renderSuggestions = () => (
    <PlanSuggestions suggestions={planSuggestions} onSelectPlan={function (planId: string): void {
      throw new Error('Function not implemented.');
    } } />
  );

  const renderActions = () => (
    <QuickActions
      onCreatePlan={handleCreatePlan}
      onSavePlan={() => console.log('Save plan')}
      onExportPlan={() => console.log('Export plan')}
    />
  );

  // --- Layout ---
  return (
    <ModernDashboardLayout
      overview={renderOverview()}
      schedule={renderSchedule()}
      suggestions={renderSuggestions()}
      actions={renderActions()}
    />
  );
}
