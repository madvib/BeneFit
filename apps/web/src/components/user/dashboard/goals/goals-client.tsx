'use client';

import { useIsMobile, useGoalsController } from '@/controllers';
import { PageContainer, TopTabNavigation } from '@/components';
import InsightsPanel from './insights-panel';
import SuggestionsPanel from './suggestions-panel';
import GoalsList from './goals-list';

export default function GoalsClient() {
  const {
    goals,
    recommendations,
    isLoading,
    error,
    handleEditGoal,
    handleDeleteGoal,
    handleShareGoal,
    handleCreateGoal,
  } = useGoalsController();

  const isMobile = useIsMobile(768);

  if (isLoading) {
    return (
      <PageContainer title="Goals" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          Loading goals...
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Goals" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  const goalsView = () => (
    <GoalsList
      goals={goals}
      onEditGoal={handleEditGoal}
      onDeleteGoal={handleDeleteGoal}
      onShareGoal={handleShareGoal}
      onCreateGoal={handleCreateGoal}
    />
  );

  const insightsView = () => <InsightsPanel />;

  const suggestionsView = () => <SuggestionsPanel recommendations={recommendations} />;

  const tabs = [
    { id: 'goals', label: 'Goals' },
    { id: 'insights', label: 'Insights' },
    { id: 'suggestions', label: 'Suggestions' },
  ];

  if (isMobile) {
    return (
      <PageContainer title="Goals" hideTitle={true}>
        <TopTabNavigation tabs={tabs} defaultActiveTab="goals">
          {{
            goals: goalsView(),
            insights: insightsView(),
            suggestions: suggestionsView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Goals" hideTitle={true}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        <div className="lg:col-span-2">{goalsView()}</div>

        <div className="space-y-6">
          {insightsView()}
          {suggestionsView()}
        </div>
      </div>
    </PageContainer>
  );
}
