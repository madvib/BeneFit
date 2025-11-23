'use client';

import ActivityFeed from '@/components/user/dashboard/feed/activity-feed';
import {
  LoadingSpinner,
  PageContainer,
  TopTabNavigation,
  ErrorPage,
} from '@/components';
import { GoalCard, ProgressChart } from '@/components/user/dashboard/feed';
import { useFeedController, useIsMobile } from '@/controllers';
import DashboardHeader from '@/components/user/dashboard/dashboard-header';
import DashboardLayoutGrid from '@/components/user/dashboard/dashboard-layout-grid';

export default function DashboardPage() {
  const { currentGoal, chartData, isLoading, error, handleSetNewGoal } =
    useFeedController();
  const isMobile = useIsMobile(768); // Increased breakpoint for demo purposes to show mobile view easier

  // Loading State
  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading Dashboard..." />;
  }

  // Error State
  if (error) {
    return (
      <ErrorPage
        title="Dashboard Loading Error"
        message="Unable to load your dashboard data."
        error={error}
        backHref="/"
      />
    );
  }

  // Views definition
  const FeedView = () => <ActivityFeed />;
  const GoalView = () => (
    <GoalCard goal={currentGoal} onSetNewGoal={handleSetNewGoal} />
  );
  const ProgressView = () => <ProgressChart data={chartData} />;

  // --- Mobile Layout (Tabs) ---
  if (isMobile) {
    const tabs = [
      { id: 'feed', label: 'Feed' },
      { id: 'goal', label: 'Goal' },
      { id: 'progress', label: 'Progress' },
    ];

    return (
      <PageContainer>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Alex.</p>
        </header>
        <TopTabNavigation tabs={tabs} defaultActiveTab="feed">
          {{
            feed: FeedView(),
            goal: GoalView(),
            progress: ProgressView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  // --- Desktop Layout (Sidebar) ---
  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          title="Dashboard"
          subtitle="Track your progress and recent activity."
          onExport={() => console.log('Export clicked')}
          onQuickLog={() => console.log('Quick Log clicked')}
        />

        <DashboardLayoutGrid
          sidebar={
            <div className="space-y-6">
              <GoalCard goal={currentGoal} onSetNewGoal={handleSetNewGoal} />
              <ProgressChart data={chartData} />
            </div>
          }
        >
          <div className="space-y-6">{FeedView()}</div>
        </DashboardLayoutGrid>
      </div>
    </PageContainer>
  );
}
