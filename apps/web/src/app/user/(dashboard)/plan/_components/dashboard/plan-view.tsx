'use client';

import { Button, EmptyState, MetricCard, PageContainer, typography } from '@/lib/components';
import {
  Edit2,
  Calendar,
  Activity,
  CheckCircle2,
  PlayCircle,
  Clock,
  Dumbbell,
  TrendingUp,
  Target,
} from 'lucide-react';

// --- Types (Inlined for self-containment) ---
export interface PlanData {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  progress: number;
}

export interface WeeklyWorkoutPlan {
  id: string;
  day: string;
  date: string;
  completed: boolean;
  exercise: string;
  sets: number;
  reps: number;
  duration?: string;
}

interface PlanViewProps {
  currentPlan: PlanData | null;
  weeklyWorkouts: WeeklyWorkoutPlan[];
  onEditPlan: (_id: string) => void;
}

export function PlanView({ currentPlan, weeklyWorkouts, onEditPlan }: Readonly<PlanViewProps>) {
  if (!currentPlan) {
    return (
      <EmptyState
        icon={Activity}
        title="No active training plan found"
        description=""
        iconClassName="opacity-20"
        className="bg-accent/20 border-muted border border-dashed rounded-xl h-64"
      />
    );
  }

  return (
    <PageContainer className="max-w-7xl space-y-8">
      {/* Main Plan Card */}
      <div className="bg-background border-muted group relative overflow-hidden rounded-xl border shadow-sm">
        {/* Header Accent Line */}
        <div className="bg-primary absolute top-0 right-0 left-0 h-1 opacity-80" />

        <div className="p-6 md:p-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <h2 className={typography.h2}>{currentPlan.name}</h2>
                <span
                  className={`${typography.labelXs} text-primary rounded-full border border-(--primary)/20 bg-(--primary)/10 px-2.5 py-0.5`}
                >
                  {currentPlan.category}
                </span>
              </div>
              <p className={`${typography.p} text-muted-foreground max-w-2xl leading-relaxed`}>
                {currentPlan.description}
              </p>
            </div>
            <Button
              onClick={() => onEditPlan(currentPlan.id)}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary h-10 w-10 rounded-xl"
              aria-label="Edit Plan"
            >
              <Edit2 size={20} />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Stat 1: Difficulty */}
            <MetricCard
              label="Difficulty"
              value={currentPlan.difficulty}
              icon={TrendingUp}
              className="bg-accent/30 border-muted/50 transition-shadow hover:shadow-sm"
              iconClassName="text-orange-500"
              bodyClassName="flex-row items-center gap-4 p-4"
            />

            {/* Stat 2: Duration */}
            <MetricCard
              label="Duration"
              value={currentPlan.duration}
              icon={Clock}
              className="bg-accent/30 border-muted/50 transition-shadow hover:shadow-sm"
              iconClassName="text-blue-500"
              bodyClassName="flex-row items-center gap-4 p-4"
            />

            {/* Stat 3: Completion (Spans 2 cols on desktop) */}
            <div className="bg-accent/30 border-muted/50 col-span-1 flex items-center gap-4 rounded-xl border p-4 md:col-span-2">
              <div className="bg-background rounded-lg p-2.5 text-green-500 shadow-sm ring-1 ring-black/5">
                <Target size={20} />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-end justify-between">
                  <p className={`${typography.labelXs} text-muted-foreground`}>Plan Progress</p>
                  <p className={`${typography.small} tabular-nums`}>{currentPlan.progress}%</p>
                </div>
                <div className="bg-background border-muted/50 h-2.5 w-full overflow-hidden rounded-full border p-[1px]">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${currentPlan.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="border-muted/60 grid grid-cols-1 gap-4 border-t pt-6 md:grid-cols-3">
            <div className="border-muted/60 border-r px-4 text-center last:border-0">
              <div className={`${typography.h3} tabular-nums`}>18</div>
              <div className={`${typography.labelXs} text-muted-foreground mt-1`}>
                Total Sessions
              </div>
            </div>
            <div className="border-muted/60 border-r px-4 text-center last:border-0">
              <div className={`${typography.h3} text-primary tabular-nums`}>12</div>
              <div className={`${typography.labelXs} text-muted-foreground mt-1`}>Completed</div>
            </div>
            <div className="px-4 text-center">
              <div className={`${typography.h3} text-muted-foreground tabular-nums`}>6</div>
              <div className={`${typography.labelXs} text-muted-foreground mt-1`}>Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Section */}
      <div>
        <div className="mb-5 flex items-center gap-2 px-1">
          <Calendar size={20} className="text-primary" />
          <h3 className={typography.large}>Weekly Schedule</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weeklyWorkouts.map((workout) => (
            <div
              key={workout.id}
              className={`group relative flex flex-col rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${
                workout.completed
                  ? 'bg-background/50 border-green-200/50 dark:border-green-900/30'
                  : 'bg-background border-muted hover:border-(--primary)/40'
              } `}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {workout.completed ? (
                  <div className="rounded-full bg-green-500/10 p-1 text-green-500 ring-1 ring-green-500/20">
                    <CheckCircle2 size={16} />
                  </div>
                ) : (
                  <div className="text-muted-foreground/20 rounded-full p-1">
                    <div className="h-4 w-4 rounded-full border-2 border-current transition-colors group-hover:border-(--primary)/40" />
                  </div>
                )}
              </div>

              {/* Date Info */}
              <div className="mb-3">
                <p className={`${typography.labelXs} text-primary mb-0.5`}>{workout.day}</p>
                <p className={`${typography.muted} font-medium`}>{workout.date}</p>
              </div>

              {/* Exercise Info */}
              <div className="mb-4 flex-1">
                <h4
                  className={`${typography.large} mb-2 line-clamp-2 leading-tight`}
                  title={workout.exercise}
                >
                  {workout.exercise}
                </h4>

                <div className="space-y-1.5">
                  {workout.sets > 0 && (
                    <div className={`${typography.muted} flex items-center gap-2 font-medium`}>
                      <Dumbbell size={14} className="opacity-70" />
                      <span>
                        {workout.sets} sets × {workout.reps} reps
                      </span>
                    </div>
                  )}
                  {workout.duration && (
                    <div className={`${typography.muted} flex items-center gap-2 font-medium`}>
                      <Clock size={14} className="opacity-70" />
                      <span>{workout.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant={workout.completed ? 'soft-success' : 'default'}
                className={`${typography.small} w-full gap-2 rounded-lg py-2.5 transition-all duration-200 ${
                  !workout.completed &&
                  'group-hover:-translate-y-px hover:opacity-90 hover:shadow'
                }`}
              >
                {workout.completed ? (
                  <span>View Details</span>
                ) : (
                  <>
                    <PlayCircle size={16} fill="currentColor" className="opacity-80" />{' '}
                    <span>Start Session</span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
