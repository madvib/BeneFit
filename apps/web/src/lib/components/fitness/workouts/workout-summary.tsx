'use client';

import { Clock, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import type { DailyWorkout } from '@bene/react-api-client';
import { getActivityTypeConfig } from '@/lib/constants/training-ui';
import { Badge, IconBox, MetricCard, typography } from '@/lib/components';

type Activity = DailyWorkout['activities'][number];

export function WorkoutSummary(workout: DailyWorkout) {

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-primary/5 border-primary/20 relative flex flex-col items-center overflow-hidden rounded-3xl border p-8 text-center sm:p-12">
        <div
          className={`${typography.labelXs} bg-primary/10 text-primary absolute top-0 right-0 flex items-center gap-1 rounded-bl-2xl px-4 py-2`}
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>Session Complete</span>
        </div>

        <IconBox icon={CheckCircle2} variant="default" size="xl" className="mb-6 rounded-3xl" />

        <h1 className={`${typography.h1} mb-2 capitalize`}>{workout.type} Summary</h1>
        <p className={`${typography.muted} max-w-md`}>
          Excellent work completing your scheduled session. You have reached another milestone in
          your fitness journey.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Duration"
          value={workout.estimatedDuration}
          unit="min"
          icon={Clock}
          className="transition-shadow hover:shadow-md"
        />

        <MetricCard
          label="Intensity"
          value="Moderate"
          icon={TrendingUp}
          className="border-orange-500/10 transition-shadow hover:shadow-md"
          iconClassName="text-orange-500"
          bodyClassName="gap-1"
        />

        <MetricCard
          label="Energy"
          value="Optimal"
          icon={Zap}
          className="border-blue-500/10 transition-shadow hover:shadow-md"
          iconClassName="text-blue-500"
          bodyClassName="gap-1"
        />
      </div>

      {/* Activity Breakdown */}
      <div className="bg-accent/30 rounded-3xl border p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className={typography.h3}>Section Breakdown</h3>
          <Badge variant="outline" className={typography.small}>
            {workout.activities?.length || 0} Sections
          </Badge>
        </div>

        <div className="space-y-3">
          {workout.activities?.map((activity: Activity, idx: number) => {
             const ActivityIcon = getActivityTypeConfig(activity.type).icon;
             return (
              <div
                key={idx}
                className="bg-card hover:border-primary/30 flex items-center justify-between rounded-2xl border p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl">
                    <ActivityIcon size={18} />
                  </div>
                  <div>
                    <p className={`${typography.small} font-black capitalize`}>{activity.type}</p>
                    <p className={typography.labelXs}>Focus Area</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${typography.small} text-foreground font-bold`}>
                    {activity.duration} min
                  </p>
                  <div className="bg-primary/20 h-1 w-12 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (activity.duration ?? 0 / workout.estimatedDuration) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
