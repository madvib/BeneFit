'use client';

import { useIsMobile, usePlanController } from '@/controllers';
import { LoadingSpinner, TopTabNavigation, ErrorPage } from '@/components';
import { PlanView, SuggestionsView } from '@/components/user/dashboard/plan';
import PlanDashboardLayout from '@/components/user/dashboard/plan/plan-dashboard-layout';

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

  // Mobile check for tabs view (< 768px)
  const isMobile = useIsMobile(768);

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
  const renderPlanView = () => (
    <PlanView
      currentPlan={currentPlan}
      weeklyWorkouts={weeklyWorkouts}
      onEditPlan={handleEditPlan}
    />
  );

  const renderSuggestionsView = () => (
    <SuggestionsView
      planSuggestions={planSuggestions}
      onCreatePlan={handleCreatePlan}
      onSavePlan={() => console.log('Save plan')}
      onExportPlan={() => console.log('Export plan')}
    />
  );

  // --- Mobile Layout (Tabs) ---
  if (isMobile) {
    const tabs = [
      { id: 'current-plan', label: 'Current Plan' },
      { id: 'suggestions', label: 'Suggestions' },
    ];

    return (
      <TopTabNavigation tabs={tabs} defaultActiveTab="current-plan">
        {{
          'current-plan': renderPlanView(),
          suggestions: renderSuggestionsView(),
        }}
      </TopTabNavigation>
    );
  }

  // --- Desktop Layout (Responsive Grid) ---
  return (
    <PlanDashboardLayout
      planView={renderPlanView()}
      suggestionsView={renderSuggestionsView()}
    />
  );
}
