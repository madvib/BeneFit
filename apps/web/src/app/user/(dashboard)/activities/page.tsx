'use client';
import { useState } from 'react';
import { Activity, Calendar } from 'lucide-react';
import { workouts, profile } from '@bene/react-api-client';
import { CompletedWorkout } from '@bene/shared';
import {
  Card,
  LoadingSpinner,
  ErrorPage,
  PageHeader,
  DashboardShell,
  ProgressBar,
  ProgressChart,
  typography,
} from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import { ActivityFeedView, WorkoutHistoryDetailModal } from './_components';

export default function ActivityFeedPage() {
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  const historyQuery = workouts.useWorkoutHistory({ query: {} });
  const profileQuery = profile.useProfile();

  if (historyQuery.isLoading || profileQuery.isLoading) {
    return <LoadingSpinner variant="screen" text="Loading your activity..." />;
  }

  if (historyQuery.error || profileQuery.error) {
    return (
      <ErrorPage
        title="Activity Error"
        message="Failed to load your activity data."
        error={(historyQuery.error || profileQuery.error) as Error}
        backHref={ROUTES.HOME}
      />
    );
  }

  const rawItems = historyQuery.data || { workouts: [] };
  const allWorkouts = (rawItems.workouts || []) as unknown as CompletedWorkout[];

  const renderSidebar = () => (
    <div className="space-y-6">
      {/* Weekly Progress Chart */}
      <ProgressChart
        data={[
          { date: 'Mon', value: 40 },
          { date: 'Tue', value: 70 },
          { date: 'Wed', value: 30 },
          { date: 'Thu', value: 85 },
          { date: 'Fri', value: 50 },
          { date: 'Sat', value: 90 },
          { date: 'Sun', value: 60 },
        ]}
      />

      {/* Activity Breakdown Chart */}
      <Card
        title="Activity Breakdown"
        icon={Activity}
        className="border-border bg-card"
        headerClassName="border-b border-border"
      >
        <div className="space-y-4">
          {[
            { label: 'Running', value: 45, color: 'bg-blue-500' },
            { label: 'Strength', value: 30, color: 'bg-green-500' },
            { label: 'Yoga', value: 15, color: 'bg-purple-500' },
            { label: 'Other', value: 10, color: 'bg-orange-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className={`${typography.mutedXs} mb-1 flex justify-between`}>
                <span className={`${typography.labelXs} text-foreground`}>{item.label}</span>
                <span className="opacity-60">{item.value}%</span>
              </div>
              <ProgressBar
                value={item.value}
                max={100}
                size="sm"
                className="mt-1"
                barVariant={item.label === 'Running' ? 'default' : 'solid'}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Stats */}
      <Card
        title="This Month"
        icon={Calendar}
        className="border-border from-primary/5 bg-linear-to-br to-transparent"
        headerClassName="bg-transparent border-b border-primary/10"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-2xl p-4">
            <p className={`${typography.displayMd} text-foreground`}>12</p>
            <p className={`${typography.mutedXs} opacity-60`}>Workouts</p>
          </div>
          <div className="bg-background/50 rounded-2xl p-4">
            <p className={`${typography.displayMd} text-foreground`}>8.5h</p>
            <p className={`${typography.mutedXs} opacity-60`}>Active Time</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <DashboardShell
      overview={
        <>
          <div className="mb-2 flex items-center justify-between">
            <PageHeader title="My Activity" />
          </div>

          <ActivityFeedView
            workouts={allWorkouts}
            userProfile={profileQuery.data ?? undefined}
            onSelectWorkout={setSelectedWorkout}
          />

          <WorkoutHistoryDetailModal
            isOpen={!!selectedWorkout}
            onClose={() => setSelectedWorkout(null)}
            workout={selectedWorkout}
          />
        </>
      }
      actions={renderSidebar()}
    />
  );
}
