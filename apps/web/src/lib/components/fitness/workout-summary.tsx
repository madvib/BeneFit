'use client';

import { Card, Typography, Badge } from '@/lib/components';
import { Clock, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import type { DailyWorkout, Activity } from '@bene/shared';
import { getActivityIcon } from './constants';

interface WorkoutSummaryProps {
  workout?: DailyWorkout;
}

export default function WorkoutSummary({ workout }: WorkoutSummaryProps) {
  if (!workout) return null;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-primary/5 border-primary/20 relative flex flex-col items-center overflow-hidden rounded-3xl border p-8 text-center sm:p-12">
        <div className="bg-primary/10 text-primary absolute top-0 right-0 flex items-center gap-1 rounded-bl-2xl px-4 py-2 text-[10px] font-black tracking-widest uppercase">
          <Sparkles size={12} className="animate-pulse" />
          <span>Session Complete</span>
        </div>

        <div className="bg-primary/20 text-primary mb-6 flex h-20 w-20 items-center justify-center rounded-3xl">
          <CheckCircle2 size={40} />
        </div>

        <Typography variant="h1" className="mb-2 text-3xl font-black capitalize sm:text-4xl">
          {workout.type} Summary
        </Typography>
        <Typography variant="muted" className="max-w-md text-sm sm:text-base">
          Excellent work completing your scheduled session. You have reached another milestone in
          your fitness journey.
        </Typography>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-primary/10 bg-card p-5 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <Typography variant="muted" className="text-[10px] tracking-widest uppercase">
                Duration
              </Typography>
              <Typography variant="h3" className="font-black">
                {workout.durationMinutes} min
              </Typography>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-orange-500/10 p-5 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <Typography variant="muted" className="text-[10px] tracking-widest uppercase">
                Intensity
              </Typography>
              <Typography variant="h3" className="font-black">
                Moderate
              </Typography>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-blue-500/10 p-5 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Zap size={24} />
            </div>
            <div>
              <Typography variant="muted" className="text-[10px] tracking-widest uppercase">
                Energy
              </Typography>
              <Typography variant="h3" className="font-black">
                Optimal
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-accent/30 rounded-3xl border p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h3" className="text-xl font-black">
            Section Breakdown
          </Typography>
          <Badge variant="outline" className="font-bold">
            {workout.activities?.length || 0} Sections
          </Badge>
        </div>

        <div className="space-y-3">
          {workout.activities?.map((activity: Activity, idx: number) => (
            <div
              key={idx}
              className="bg-card hover:border-primary/30 flex items-center justify-between rounded-2xl border p-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-xl">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <Typography variant="small" className="font-black capitalize">
                    {activity.type}
                  </Typography>
                  <Typography variant="muted" className="text-[10px] tracking-tighter uppercase">
                    Focus Area
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="small" className="text-foreground font-black">
                  {activity.durationMinutes} min
                </Typography>
                <div className="bg-primary/20 h-1 w-12 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (activity.durationMinutes / workout.durationMinutes) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
