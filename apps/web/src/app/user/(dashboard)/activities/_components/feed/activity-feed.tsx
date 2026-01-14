'use client';

import { Button, Card, EmptyState, typography } from '@/lib/components';
import { Activity, ArrowRight, Sparkles, History } from 'lucide-react';
import { workouts } from '@bene/react-api-client';
import ActivityListTile from './activity-list-tile';

import type { CompletedWorkout } from '@bene/shared';

export default function ActivityFeed() {
  const historyQuery = workouts.useWorkoutHistory({ query: { limit: '5' } });

  const renderContent = () => {
    if (historyQuery.isLoading) {
      return (
        <div className="flex flex-col gap-4 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex gap-4 p-4">
              <div className="bg-muted h-10 w-10 animate-pulse rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      );
    }
    // TODO should probably use inline Error component here
    if (historyQuery.error) {
      return (
        <EmptyState
          icon={Activity}
          title="Something went wrong"
          description="We couldn't load your recent activity. Please try again later."
          iconClassName="bg-destructive/10 text-destructive"
        />
      );
    }

    const workoutsData = (historyQuery.data?.workouts || []) as unknown as CompletedWorkout[];

    if (workoutsData.length === 0) {
      return (
        <EmptyState
          icon={History}
          title="No Activity Yet"
          description="Your recent workouts and achievements will appear here once you start training."
          action={
            <Button variant="outline" size="sm" className="mt-2 rounded-xl">
              Start First Workout
            </Button>
          }
        />
      );
    }

    return (
      <div className="flex flex-col">
        {workoutsData.map((workout) => (
          <ActivityListTile
            key={workout.id}
            workout={workout}
            // No edit action in feed usually, but can be added if needed
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border-none shadow-none">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          {/*IconBox? */}
          <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles size={16} />
          </div>
          <h4 className={`${typography.h4} italic`}>Recent Activity</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`${typography.labelXs} text-muted-foreground hover:text-primary -mr-2 rounded-xl transition-colors`}
        >
          View All <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">{renderContent()}</div>
    </Card>
  );
}
