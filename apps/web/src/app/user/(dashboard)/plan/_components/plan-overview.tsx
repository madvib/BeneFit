'use client';

import { Trophy, Flame, Timer, Zap, Activity, Edit2, Target, Calendar } from 'lucide-react';
import type { fitnessPlan } from '@bene/react-api-client';
import { SpotlightCard, Typography, Badge, Button } from '@/lib/components';

// Extract plan type from API response
type PlanData = NonNullable<fitnessPlan.GetActivePlanResponse['plan']>;

interface PlanOverviewProps {
  currentPlan: PlanData | null;
  onEditPlan: (_id: string) => void;
}

export default function PlanOverview({ currentPlan, onEditPlan }: PlanOverviewProps) {
  if (!currentPlan) {
    return (
      <div className="border-muted bg-accent/5 animate-in fade-in zoom-in-95 flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center duration-500">
        <div className="bg-accent/10 mb-4 rounded-full p-4">
          <Activity size={32} className="text-muted-foreground opacity-50" />
        </div>
        <Typography variant="h4">No Active Plan</Typography>
        <Typography variant="muted" className="max-w-[200px]">
          Start a new plan to see your progress here.
        </Typography>
      </div>
    );
  }

  const weeklyProgress = currentPlan.summary.completed;
  const totalWorkouts = currentPlan.summary.total;
  const progressPercentage = (weeklyProgress / totalWorkouts) * 100;

  return (
    <SpotlightCard className="from-primary/10 via-background to-background border-primary/20 relative overflow-hidden bg-linear-to-br shadow-2xl">
      {/* Decorative background element */}
      <div className="bg-primary/5 absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <Trophy size={20} />
            </div>
            <div>
              <Typography variant="h3" className="font-black tracking-tighter uppercase italic">
                Active Plan
              </Typography>
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase"
              >
                Fitness Journey
              </Typography>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditPlan(currentPlan.id)}
            className="text-muted-foreground hover:text-primary -mr-2 rounded-full transition-all"
          >
            <Edit2 size={18} />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Main Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex flex-wrap gap-2 text-[10px] font-black tracking-widest uppercase">
                <Badge variant="success" className="rounded-lg px-2 py-0.5">
                  Week {currentPlan.currentWeek}
                </Badge>
                {currentPlan.planType && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/5 rounded-lg px-2 py-0.5"
                  >
                    {currentPlan.planType}
                  </Badge>
                )}
              </div>
              <Typography
                variant="h1"
                className="mb-2 text-3xl font-black capitalize sm:text-4xl"
              >
                {currentPlan.title}
              </Typography>
              <Typography variant="muted" className="line-clamp-2 max-w-sm text-sm">
                {currentPlan.description ||
                  'Dedication and consistency are the keys to your success. Keep pushing!'}
              </Typography>
            </div>

            {/* Progress Visualization */}
            <div className="bg-primary/5 border-primary/10 relative overflow-hidden rounded-3xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-primary" />
                  <Typography variant="small" className="font-black tracking-widest uppercase">
                    Weekly Goal
                  </Typography>
                </div>
                <Typography variant="small" className="text-primary font-black italic">
                  {Math.round(progressPercentage)}% Complete
                </Typography>
              </div>

              <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="bg-primary cubic-bezier(0.34, 1.56, 0.64, 1) h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="h-full w-full animate-pulse bg-white/20" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <Typography variant="h2" className="text-4xl font-black italic">
                  {weeklyProgress}
                </Typography>
                <Typography
                  variant="muted"
                  className="text-xs font-bold tracking-widest uppercase"
                >
                  of {totalWorkouts} sessions met
                </Typography>
              </div>
            </div>
          </div>

          {/* Details & Stats */}
          <div className="flex flex-col justify-between space-y-6">
            {/* Date Range Glass Component */}
            <div className="bg-background/40 ring-border/50 flex items-center gap-4 rounded-2xl p-4 ring-1 backdrop-blur-xl">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Calendar size={20} />
              </div>
              <div>
                <Typography
                  variant="muted"
                  className="text-[10px] leading-none font-black tracking-widest uppercase"
                >
                  Timeline
                </Typography>
                <Typography variant="small" className="font-black">
                  {new Date(currentPlan.startDate!).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' — '}
                  {new Date(currentPlan.endDate!).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Completed',
                  value: currentPlan.summary.completed,
                  icon: Flame,
                  color: 'text-orange-500',
                  bg: 'bg-orange-500/10',
                },
                {
                  label: 'Total',
                  value: currentPlan.summary.total,
                  icon: Timer,
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10',
                },
                {
                  label: 'Status',
                  value: currentPlan.status,
                  icon: Zap,
                  color: 'text-green-500',
                  bg: 'bg-green-500/10',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-background/20 hover:bg-background/40 flex flex-col items-center justify-center rounded-2xl border border-white/5 p-3 text-center transition-all"
                >
                  <stat.icon size={18} className={`${stat.color} mb-1.5`} />
                  <Typography variant="small" className="mb-1 leading-none font-black capitalize">
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="text-[9px] font-black tracking-tighter uppercase"
                  >
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>

            {/* Primary Goal Section */}
            <div className="from-primary/10 border-primary/20 rounded-2xl border bg-linear-to-br to-transparent p-4">
              <div className="mb-3 flex items-center gap-3">
                <Target size={18} className="text-primary" />
                <Typography variant="small" className="font-black tracking-widest uppercase">
                  North Star
                </Typography>
              </div>
              <Typography variant="h4" className="mb-2 leading-none font-black capitalize italic">
                {currentPlan.goals?.primary.replaceAll('_', ' ') || 'Get Fit'}
              </Typography>
              {currentPlan.goals?.secondary && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {currentPlan.goals.secondary.map((goal) => (
                    <Badge
                      key={goal}
                      variant="outline"
                      className="bg-background/30 border-primary/10 text-[9px] font-black tracking-tighter uppercase"
                    >
                      {goal.replaceAll('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
