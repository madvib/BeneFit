'use client';

import ActivityFeed from '@/components/user/dashboard/feed/activity-feed';
import { DashboardLayout, PageContainer, TopTabNavigation } from '@/components';
import { GoalCard, ProgressChart } from '@/components/user/dashboard/feed';
import { useFeedController, useIsMobile } from '@/controllers';

export default function DashboardPage() {
  const { currentGoal, chartData, isLoading, error, handleSetNewGoal } =
    useFeedController();

  const isMobile = useIsMobile(768);

  if (isLoading) {
    return (
      <PageContainer title="Welcome, User!" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          Loading feed data...
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Welcome, User!" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  const feedView = () => (
    <div className="space-y-4">
      <ActivityFeed />
    </div>
  );

  const goalView = () => (
    <div className="space-y-4">
      <GoalCard goal={currentGoal} onSetNewGoal={handleSetNewGoal} />
    </div>
  );

  const progressView = () => (
    <div className="space-y-4">
      <ProgressChart data={chartData} />
    </div>
  );

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'goal', label: 'Goal' },
    { id: 'progress', label: 'Progress' },
  ];

  if (isMobile) {
    return (
      <PageContainer>
        <TopTabNavigation tabs={tabs} defaultActiveTab="feed">
          {{
            feed: feedView(),
            goal: goalView(),
            progress: progressView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Welcome, User!" hideTitle={true}>
      <DashboardLayout
        sidebar={
          <div className="space-y-6 w-full">
            <GoalCard goal={currentGoal} onSetNewGoal={handleSetNewGoal} />
            <ProgressChart data={chartData} />
          </div>
        }
      >
        <ActivityFeed />
      </DashboardLayout>
    </PageContainer>
  );
}
