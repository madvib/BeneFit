import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { Activity, Calendar, Flame, Trophy, TrendingUp } from 'lucide-react';
import { useWorkoutHistory, useProfile, useUserStats, CompletedWorkout } from '@bene/react-api-client';
import {
  Card,
  LoadingSpinner,
  ErrorPage,
  PageHeader,
  DashboardShell,
  ProgressBar,
  typography,
  CompletedWorkoutView
} from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import { ActivityFeedView } from './-components/activities';

export const Route = createFileRoute('/$user/_dashboard/activities')({
  component: ActivityFeedPage,
});

function ActivityFeedPage() {
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  const historyQuery = useWorkoutHistory({ query: {} });
  const profileQuery = useProfile();
  const statsQuery = useUserStats();

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

  return (
    <DashboardShell
      overview={
        <>
          <div className="mb-4 flex flex-col items-center">
            <PageHeader title="My Activity" className="text-center" />
          </div>

          <ActivityFeedView
            workouts={allWorkouts}
            userProfile={profileQuery.data ?? undefined}
            onSelectWorkout={setSelectedWorkout}
          />

          {selectedWorkout && (
            <CompletedWorkoutView
              isOpen={!!selectedWorkout}
              onClose={() => setSelectedWorkout(null)}
              workout={selectedWorkout}
              variant="modal"
            />
          )}
        </>
      }
      actions={
        <ActivitySidebar workouts={allWorkouts} stats={statsQuery.data} />
      }
    />
  );
}

function ActivitySidebar({
  workouts,
  stats,
}: {
  workouts: CompletedWorkout[];
  stats?: ReturnType<typeof useUserStats>['data'];
}) {
  const breakdown = useMemo(() => computeBreakdown(workouts), [workouts]);
  const monthStats = useMemo(() => computeMonthStats(workouts), [workouts]);

  return (
    <div className="space-y-6">
      {/* Streak & Achievements */}
      {stats && (
        <Card className="border-primary/20 from-primary/5 bg-linear-to-br to-transparent p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <Flame className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className={`${typography.displaySm} text-foreground`}>{stats.currentStreak}</p>
                <p className={`${typography.mutedXs} opacity-60`}>Day Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <Trophy className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className={`${typography.displaySm} text-foreground`}>{stats.achievementsCount ?? stats.achievements?.length ?? 0}</p>
                <p className={`${typography.mutedXs} opacity-60`}>Achievements</p>
              </div>
            </div>
          </div>
          {stats.longestStreak > 0 && (
            <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Best streak: {stats.longestStreak} days</span>
            </div>
          )}
        </Card>
      )}

      {/* Activity Breakdown (from real data) */}
      <Card
        title="Activity Breakdown"
        icon={Activity}
        className="border-border bg-card"
        headerClassName="border-b border-border"
      >
        {breakdown.length > 0 ? (
          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className={`${typography.mutedXs} mb-1 flex justify-between`}>
                  <span className={`${typography.labelXs} text-foreground`}>{item.label}</span>
                  <span className="opacity-60">{item.pct}%</span>
                </div>
                <ProgressBar
                  value={item.pct}
                  max={100}
                  size="sm"
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={`${typography.mutedXs} py-4 text-center`}>
            Complete workouts to see your breakdown
          </p>
        )}
      </Card>

      {/* Monthly Stats (from real data) */}
      <Card
        title="This Month"
        icon={Calendar}
        className="border-border from-primary/5 bg-linear-to-br to-transparent"
        headerClassName="bg-transparent border-b border-primary/10"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-2xl p-4">
            <p className={`${typography.displayMd} text-foreground`}>{monthStats.count}</p>
            <p className={`${typography.mutedXs} opacity-60`}>Workouts</p>
          </div>
          <div className="bg-background/50 rounded-2xl p-4">
            <p className={`${typography.displayMd} text-foreground`}>{monthStats.hours}</p>
            <p className={`${typography.mutedXs} opacity-60`}>Active Time</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/** Compute workout type breakdown from real data */
function computeBreakdown(workouts: CompletedWorkout[]) {
  if (workouts.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const w of workouts) {
    const type = w.workoutType || 'Other';
    const label = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    counts[label] = (counts[label] || 0) + 1;
  }

  const total = workouts.length;
  return Object.entries(counts)
    .map(([label, count]) => ({ label, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
}

/** Compute this month's workout count and hours from real data */
function computeMonthStats(workouts: CompletedWorkout[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = workouts.filter((w) => {
    const date = w.recordedAt ? new Date(w.recordedAt) : null;
    return date && date >= monthStart;
  });

  const totalMinutes = thisMonth.reduce(
    (sum, w) => sum + (w.performance?.durationMinutes || 0),
    0,
  );

  const hours = totalMinutes >= 60
    ? `${(totalMinutes / 60).toFixed(1)}h`
    : `${totalMinutes}m`;

  return { count: thisMonth.length, hours };
}
