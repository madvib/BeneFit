'use client';

import { Activity, ArrowRight, Sparkles, History } from 'lucide-react';
import { Button, Typography, Badge, Card } from '@/lib/components';
import { workouts } from '@bene/react-api-client';
import { safeFormatTimeAgo } from '@/lib/utils/date-format';
import {
  getActivityColorClass,
  getActivityIcon,
} from '../../../../../lib/components/fitness/constants';

export default function ActivityFeed() {
  const historyQuery = workouts.useWorkoutHistory({ query: { limit: '5' } });

  const renderContent = () => {
    if (historyQuery.isLoading) {
      return (
        <div className="flex flex-col gap-4 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-muted/40 flex gap-4 rounded-2xl border p-4">
              <div className="bg-muted/50 h-10 w-10 animate-pulse rounded-xl" />
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
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="bg-destructive/10 text-destructive mb-2 rounded-full p-4">
            <Activity size={32} />
          </div>
          <Typography variant="h4">Something went wrong</Typography>
          <Typography variant="muted" className="max-w-[240px]">
            We couldn&apos;t load your recent activity. Please try again later.
          </Typography>
        </div>
      );
    }

    const workoutsData = historyQuery.data?.workouts || [];

    if (workoutsData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="bg-accent/50 text-muted-foreground mb-2 rounded-full p-4">
            <History size={32} />
          </div>
          <Typography variant="h4">No Activity Yet</Typography>
          <Typography variant="muted" className="max-w-[240px]">
            Your recent workouts and achievements will appear here once you start training.
          </Typography>
          <Button variant="outline" size="sm" className="mt-2 rounded-xl">
            Start First Workout
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-6">
        {workoutsData.map((workout) => (
          <div
            key={workout.id}
            className="group border-border/50 bg-card hover:border-primary/40 hover:bg-accent/5 relative flex gap-4 rounded-2xl border p-4 transition-all duration-300"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 shadow-sm ${getActivityColorClass('workout')}`}
            >
              {getActivityIcon('workout')}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <Typography
                  variant="small"
                  className="text-foreground group-hover:text-primary truncate font-black transition-colors"
                >
                  {workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)}{' '}
                  Workout
                </Typography>
                <Typography
                  variant="muted"
                  className="shrink-0 text-[10px] font-bold tracking-tighter uppercase"
                >
                  {safeFormatTimeAgo(workout.recordedAt)}
                </Typography>
              </div>
              <Typography variant="muted" className="line-clamp-1 text-xs">
                Completed {workout.performance.durationMinutes} min session •{' '}
                {workout.performance.caloriesBurned || 0} kcal
              </Typography>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                    {workout.performance.durationMinutes}m
                  </Badge>
                  {workout.performance.caloriesBurned && (
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-bold">
                      {workout.performance.caloriesBurned} kcal
                    </Badge>
                  )}
                </div>
                <div className="text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border-none shadow-none">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles size={16} />
          </div>
          <Typography variant="h4" className="text-lg font-black italic">
            Recent Activity
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary -mr-2 rounded-xl text-xs font-bold transition-colors"
        >
          View All <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">{renderContent()}</div>
    </Card>
  );
}
