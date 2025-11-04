'use client';

import { useIsMobile, usePlanController } from '@/controllers';
import { PageContainer, TopTabNavigation, DashboardLayout } from '@/components';
import PlanView from './plan-view';
import SuggestionsView from './suggestions-view';

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

  const isMobile = useIsMobile(768);

  if (isLoading || !currentPlan) {
    return (
      <PageContainer title="Training Plan" hideTitle={true}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Training Plan" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  const planView = () => (
    <PlanView
      currentPlan={currentPlan}
      weeklyWorkouts={weeklyWorkouts}
      onEditPlan={handleEditPlan}
    />
  );

  const suggestionsView = () => (
    <SuggestionsView
      planSuggestions={planSuggestions}
      onCreatePlan={handleCreatePlan}
      onSavePlan={() => console.log('Save plan')}
      onExportPlan={() => console.log('Export plan')}
    />
  );

  const tabs = [
    { id: 'current-plan', label: 'Current Plan' },
    { id: 'suggestions', label: 'Suggestions' },
  ];

  if (isMobile) {
    return (
      <PageContainer title="Training Plan" hideTitle={true}>
        <TopTabNavigation tabs={tabs} defaultActiveTab="current-plan">
          {{
            'current-plan': planView(),
            suggestions: suggestionsView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Training Plan" hideTitle={true}>
      <DashboardLayout sidebar={<div>{suggestionsView()}</div>}>
        {planView()}
      </DashboardLayout>
    </PageContainer>
  );
}
