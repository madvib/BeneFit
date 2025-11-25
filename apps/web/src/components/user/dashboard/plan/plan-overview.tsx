'use client';

import { Trophy, Flame, Timer, Zap, Activity, Edit2 } from 'lucide-react';
import { PlanData } from './types';
import { Card } from '@/components/common/ui-primitives/card/card';

interface PlanOverviewProps {
  currentPlan: PlanData | null;
  onEditPlan: (id: string) => void;
}

export default function PlanOverview({ currentPlan, onEditPlan }: PlanOverviewProps) {
  if (!currentPlan) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-muted bg-accent/5 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-4 rounded-full bg-accent/10 p-4">
          <Activity size={32} className="text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Active Plan</h3>
        <p className="text-sm text-muted-foreground">Start a new plan to see your progress here.</p>
      </div>
    );
  }

  return (
    <Card
      title="My Plan"
      icon={Trophy}
      className="h-full border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg"
      headerClassName="bg-transparent border-b border-primary/10"
      headerAction={
        <button
          onClick={() => onEditPlan(currentPlan.id)}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <Edit2 size={18} />
        </button>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Progress Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Weekly Goal</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-primary">
                {currentPlan.weeklyProgress}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                / {currentPlan.totalWorkouts} workouts
              </span>
            </div>
          </div>
          <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm">
            <div
              className="h-full w-full bg-primary transition-all duration-1000 ease-out"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${
                  (currentPlan.weeklyProgress / currentPlan.totalWorkouts) * 100
                }%, 0 ${(currentPlan.weeklyProgress / currentPlan.totalWorkouts) * 100}%)`,
              }}
            />
          </div>
        </div>

        {/* Current Phase */}
        <div className="rounded-xl bg-background/50 p-4 ring-1 ring-border/50 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary uppercase tracking-wide">
              Current Phase
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Week {currentPlan.currentWeek} of {currentPlan.totalWeeks}
            </span>
          </div>
          <h3 className="mb-1 text-xl font-bold text-foreground">{currentPlan.phase}</h3>
          <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-background/50 p-3 text-center ring-1 ring-border/50 transition-colors hover:bg-background/80">
            <div className="mb-1 flex justify-center text-orange-500">
              <Flame size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{currentPlan.stats.streak}</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Day Streak
            </div>
          </div>
          <div className="rounded-xl bg-background/50 p-3 text-center ring-1 ring-border/50 transition-colors hover:bg-background/80">
            <div className="mb-1 flex justify-center text-blue-500">
              <Timer size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{currentPlan.stats.minutes}</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Active Mins
            </div>
          </div>
          <div className="rounded-xl bg-background/50 p-3 text-center ring-1 ring-border/50 transition-colors hover:bg-background/80">
            <div className="mb-1 flex justify-center text-green-500">
              <Zap size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{currentPlan.stats.calories}</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Calories
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
