'use client';

import { Badge, Button, Card, DateDisplay, IconBox, typography } from '@/lib/components';
import { Trophy, Flame, Timer, Zap, Activity, Edit2, Target, Calendar } from 'lucide-react';
import type { fitnessPlan } from '@bene/react-api-client';

// Extract plan type from API response
type PlanData = NonNullable<fitnessPlan.GetActivePlanResponse['plan']>;

interface PlanOverviewProps {
  currentPlan: PlanData | null;
  onEditPlan: (_id: string) => void;
}

export function PlanOverview({ currentPlan, onEditPlan }: Readonly<PlanOverviewProps>) {
  if (!currentPlan) {
    return (
      <div className="border-muted bg-accent/5 animate-in fade-in zoom-in-95 flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center duration-500">
        <div className="bg-accent/10 mb-4 rounded-full p-4">
          <Activity size={32} className="text-muted-foreground opacity-50" />
        </div>
        <h4 className={typography.h4}>No Active Plan</h4>
        <p className={`${typography.muted} max-w-[200px]`}>
          Start a new plan to see your progress here.
        </p>
      </div>
    );
  }

  const weeklyProgress = currentPlan.summary.completed;
  const totalWorkouts = currentPlan.summary.total;
  const progressPercentage = (weeklyProgress / totalWorkouts) * 100;

  return (
    <Card className="from-primary/10 via-background to-background border-primary/20 relative overflow-hidden bg-linear-to-br shadow-2xl">
      {/* Decorative background element */}
      <div className="bg-primary/5 absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IconBox icon={Trophy} variant="default" size="md" className="rounded-xl" />
            <div>
              <h3 className={`${typography.h3} italic`}>Active Plan</h3>
              <p className={`${typography.mutedXs} opacity-60`}>Fitness Journey</p>
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
              <div className={`${typography.mutedXs} mb-2 flex flex-wrap gap-2 opacity-80`}>
                <Badge variant="success" className="px-2 py-0.5">
                  Week {currentPlan.currentWeek}
                </Badge>
                {currentPlan.planType && (
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 px-2 py-0.5">
                    {currentPlan.planType}
                  </Badge>
                )}
              </div>
              <h1 className={`${typography.displayMd} mb-2 capitalize italic`}>
                {currentPlan.title}
              </h1>
              <p className={`${typography.muted} line-clamp-2 max-w-sm`}>
                {currentPlan.description ||
                  'Dedication and consistency are the keys to your success. Keep pushing!'}
              </p>
            </div>

            {/* Progress Visualization */}
            <div className="bg-primary/5 border-primary/10 relative overflow-hidden rounded-3xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-primary" />
                  <p className={`${typography.labelXs} opacity-60`}>Weekly Goal</p>
                </div>
                <p className={`${typography.small} text-primary italic`}>
                  {Math.round(progressPercentage)}% Complete
                </p>
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
                <h2 className={`${typography.displayLg} italic`}>{weeklyProgress}</h2>
                <p className={`${typography.mutedXs} opacity-60`}>
                  of {totalWorkouts} sessions met
                </p>
              </div>
            </div>
          </div>

          {/* Details & Stats */}
          <div className="flex flex-col justify-between space-y-6">
            {/* Date Range Glass Component */}
            <div className="bg-background/40 ring-border/50 flex items-center gap-4 rounded-2xl p-4 ring-1 backdrop-blur-xl">
              <IconBox icon={Calendar} variant="default" size="md" className="rounded-xl" />
              <div>
                <p className={`${typography.mutedXs} opacity-60`}>Timeline</p>
                <p className={`${typography.small} font-bold`}>
                  <DateDisplay date={currentPlan.startDate!} options={{ month: 'short', day: 'numeric' }} />
                  {' — '}
                  <DateDisplay date={currentPlan.endDate!} format="short" />
                </p>
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
                  <p className={`${typography.small} mb-1 leading-none font-bold capitalize`}>
                    {stat.value}
                  </p>
                  <p className={`${typography.mutedXs} opacity-50`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Primary Goal Section */}
            <div className="from-primary/10 border-primary/20 rounded-2xl border bg-linear-to-br to-transparent p-4">
              <div className="mb-3 flex items-center gap-3">
                <Target size={18} className="text-primary" />
                <p className={`${typography.labelXs} opacity-60`}>North Star</p>
              </div>
              <h4 className={`${typography.h4} mb-2 leading-none capitalize italic`}>
                {currentPlan.goals?.primary.replaceAll('_', ' ') || 'Get Fit'}
              </h4>
              {currentPlan.goals?.secondary && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {currentPlan.goals.secondary.map((goal) => (
                    <Badge
                      key={goal}
                      variant="outline"
                      className={`${typography.mutedXs} bg-background/30 border-primary/10`}
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
    </Card>
  );
}
