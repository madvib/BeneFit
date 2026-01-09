'use client';

import { Trophy, Flame, Timer, Zap, Activity, Edit2 } from 'lucide-react';
import type { fitnessPlan } from '@bene/react-api-client';
import { Card } from '@/lib/components';

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
        <h3 className="text-foreground text-lg font-semibold">No Active Plan</h3>
        <p className="text-muted-foreground text-sm">
          Start a new plan to see your progress here.
        </p>
      </div>
    );
  }

  // Calculate progress from summary
  const weeklyProgress = currentPlan.summary.completed;
  const totalWorkouts = currentPlan.summary.total;

  return (
    <Card
      title="My Plan"
      icon={Trophy}
      className="border-primary/20 from-card to-primary/5 h-full bg-gradient-to-br shadow-lg"
      headerClassName="bg-transparent border-b border-primary/10"
      headerAction={
        <button
          onClick={() => onEditPlan(currentPlan.id)}
          className="text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full p-2 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Progress Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Weekly Goal</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-primary text-4xl font-bold tracking-tight">
                {weeklyProgress}
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                / {totalWorkouts} workouts
              </span>
            </div>
          </div>
          <div className="border-background bg-muted h-16 w-16 overflow-hidden rounded-full border-4 shadow-sm">
            <div
              className="bg-primary h-full w-full transition-all duration-1000 ease-out"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${
                  (weeklyProgress / totalWorkouts) * 100
                }%, 0 ${(weeklyProgress / totalWorkouts) * 100}%)`,
              }}
            />
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-background/50 ring-border/50 rounded-xl p-4 ring-1 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
                Week {currentPlan.currentWeek}
              </span>
              {currentPlan.planType && (
                <span className="bg-secondary/10 text-secondary-foreground border-secondary/20 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
                  {currentPlan.planType}
                </span>
              )}
            </div>
            <span className="text-muted-foreground text-xs font-medium">
              {currentPlan.durationWeeks} Weeks Total
            </span>
          </div>
          <h3 className="text-foreground mb-1 text-xl font-bold">{currentPlan.title}</h3>
          <p className="text-muted-foreground mb-3 text-sm">
            {currentPlan.description || 'Keep up the great work!'}
          </p>

          {currentPlan.startDate && currentPlan.endDate && (
            <div className="text-muted-foreground border-border/50 mt-3 flex items-center gap-2 border-t pt-3 text-xs">
              <Timer size={14} />
              <span>
                {new Date(currentPlan.startDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
                {' - '}
                {new Date(currentPlan.endDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background/50 ring-border/50 hover:bg-background/80 rounded-xl p-3 text-center ring-1 transition-colors">
            <div className="mb-1 flex justify-center text-orange-500">
              <Flame size={20} />
            </div>
            <div className="text-foreground text-lg font-bold">
              {currentPlan.summary.completed}
            </div>
            <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Completed
            </div>
          </div>
          <div className="bg-background/50 ring-border/50 hover:bg-background/80 rounded-xl p-3 text-center ring-1 transition-colors">
            <div className="mb-1 flex justify-center text-blue-500">
              <Timer size={20} />
            </div>
            <div className="text-foreground text-lg font-bold">{currentPlan.summary.total}</div>
            <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Total
            </div>
          </div>
          <div className="bg-background/50 ring-border/50 hover:bg-background/80 rounded-xl p-3 text-center ring-1 transition-colors">
            <div className="mb-1 flex justify-center text-green-500">
              <Zap size={20} />
            </div>
            <div className="text-foreground text-lg font-bold">{currentPlan.status}</div>
            <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Status
            </div>
          </div>
        </div>
        {/* Goals Section */}
        <div className="bg-background/40 rounded-xl border border-dashed p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Primary Goal
              </p>
              <p className="text-foreground font-semibold capitalize">
                {currentPlan.goals?.primary.replaceAll('_', ' ') || 'Get Fit'}
              </p>
            </div>
            {currentPlan.goals?.targetDate && (
              <div className="text-right">
                <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                  Target Date
                </p>
                <p className="text-foreground font-semibold">
                  {new Date(currentPlan.goals.targetDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {currentPlan.goals?.secondary && currentPlan.goals.secondary.length > 0 && (
            <div className="mt-3 border-t border-dashed pt-3">
              <p className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Focus Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {currentPlan.goals.secondary.map((goal) => (
                  <span
                    key={goal}
                    className="bg-primary/5 text-primary border-primary/20 rounded-md border px-2 py-0.5 text-xs font-medium capitalize"
                  >
                    {goal.replaceAll('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
