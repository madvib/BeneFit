'use client';

import { useIsMobile, useGoalsController } from '@/controllers';
import {
  LoadingSpinner,
  PageContainer,
  TopTabNavigation,
  ErrorPage,
} from '@/components';
import {
  InsightsPanel,
  SuggestionsPanel,
  GoalsList,
} from '@/components/user/dashboard/goals';
import GoalsDashboardLayout from '@/components/user/dashboard/goals/goals-dashboard-layout';

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
    return <LoadingSpinner variant="screen" text="Loading goals..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Goals Loading Error"
        message="Unable to load your goals data."
        error={error}
        backHref="/"
      />
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
      <PageContainer>
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
    <PageContainer>
      <GoalsDashboardLayout
        goalsView={goalsView()}
        sidebar={
          <div className="space-y-6">
            {insightsView()}
            {suggestionsView()}
          </div>
        }
      />
    </PageContainer>
  );
}
