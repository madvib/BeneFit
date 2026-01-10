'use client';

import { Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/lib/components';
import { workouts } from '@bene/react-api-client';
import { safeFormatTimeAgo } from '@/lib/utils/date-format';
import { getActivityColorClass, getActivityIcon } from '../../_shared/activity-styles';

export default function ActivityFeed() {
  const historyQuery = workouts.useWorkoutHistory({ query: { limit: '5' } });

  const renderContent = () => {
    if (historyQuery.isLoading) {
      return (
        <div className="flex flex-col gap-4 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-muted/40 flex gap-4 rounded-xl border p-4">
              <div className="bg-muted/50 h-10 w-10 animate-pulse rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted/50 h-4 w-1/3 animate-pulse rounded" />
                <div className="bg-muted/30 h-3 w-3/4 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (historyQuery.error) {
      return (
        <div className="flex flex-col gap-4 p-6">
          <div className="text-destructive flex flex-col items-center justify-center py-12 text-center">
            <Activity size={32} className="mb-3 opacity-20" />
            <p>Failed to load recent activity.</p>
          </div>
        </div>
      );
    }

    const workoutsData = historyQuery.data?.workouts || [];

    if (workoutsData.length === 0) {
      return (
        <div className="flex flex-col gap-4 p-6">
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            <Activity size={32} className="mb-3 opacity-20" />
            <p>No recent activity to display.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-6">
        {workoutsData.map((workout) => (
          <div
            key={workout.id}
            className="group border-muted bg-card hover:border-primary/40 relative flex gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getActivityColorClass('workout')}`}
            >
              {getActivityIcon('workout')}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-foreground group-hover:text-primary truncate text-sm font-bold transition-colors">
                  {workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)}{' '}
                  Workout
                </h4>
                <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
                  {safeFormatTimeAgo(workout.recordedAt)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Completed {workout.performance.durationMinutes} min workout
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-[10px] font-medium">
                  {workout.performance.durationMinutes} min
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-background border-muted flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="border-muted bg-accent/20 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 p-0 text-xs font-medium transition-colors"
        >
          View All <ArrowRight size={12} />
        </Button>
      </div>

      {renderContent()}
    </div>
  );
}
