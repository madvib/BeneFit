'use client';

import { Badge, Button, Card, EmptyState, IconBox, ProgressBar, typography } from '@/lib/components';
import type { fitnessPlan } from '@bene/react-api-client';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  PlayCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

// Extract plan type from API response
type PlanData = NonNullable<fitnessPlan.GetActivePlanResponse['plan']>;

interface WeeklyScheduleProps {
  plan: PlanData;
  selectedWeek: number;
  onWeekChange: (_week: number) => void;
  onWorkoutClick: (_id: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeeklySchedule({
  plan,
  selectedWeek,
  onWeekChange,
  onWorkoutClick,
}: Readonly<WeeklyScheduleProps>) {
  const weekData = plan.weeks.find((w) => w.weekNumber === selectedWeek);
  const weeklyWorkouts = weekData?.workouts || [];

  const handlePrevWeek = () => {
    if (selectedWeek > 1) onWeekChange(selectedWeek - 1);
  };

  const handleNextWeek = () => {
    if (selectedWeek < plan.durationWeeks) onWeekChange(selectedWeek + 1);
  };

  return (
    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <IconBox icon={Calendar} variant="default" size="md" className="rounded-xl" />
          <div>
            <h3 className={`${typography.small} italic`}>Training Schedule</h3>
            <p className={typography.mutedXs}>Weekly Overview</p>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="bg-accent/40 ring-border/50 flex items-center gap-2 rounded-2xl p-1.5 ring-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevWeek}
            disabled={selectedWeek === 1}
            className="h-8 w-8 rounded-xl p-0 transition-all disabled:opacity-20"
          >
            <ChevronLeft size={16} />
          </Button>
          <p className={`${typography.small} min-w-[100px] text-center`}>
            Week {selectedWeek} of {plan.durationWeeks}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextWeek}
            disabled={selectedWeek === plan.durationWeeks}
            className="h-8 w-8 rounded-xl p-0 transition-all disabled:opacity-20"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Weekly Header & Stats */}
        {weekData && (
          <div className="from-accent/30 to-accent/10 border-border/50 grid grid-cols-1 gap-6 rounded-3xl border bg-linear-to-r p-6 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <p className={typography.mutedXs}>Focus Phase</p>
              <p className={`${typography.small} italic`}>Strength & Power Building</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className={typography.mutedXs}>Commitment</p>
              <p className={typography.small}>{weeklyWorkouts.length} Sessions Planned</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className={typography.mutedXs}>Week Progress</p>
                <p className={`${typography.small} text-primary italic`}>
                  {weeklyWorkouts.filter((w) => w.status === 'completed').length} /{' '}
                  {weeklyWorkouts.length}
                </p>
              </div>
              <ProgressBar
                value={weeklyWorkouts.filter((w) => w.status === 'completed').length}
                max={weeklyWorkouts.length || 1}
                size="sm"
                barVariant="default"
              />
            </div>
          </div>
        )}

        {/* Workouts Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {weeklyWorkouts.length === 0 && (
            <EmptyState
              icon={Calendar}
              title="No sessions drafted"
              description="No sessions drafted for this week yet."
              className="bg-accent/20 border-border/50 col-span-full rounded-2xl border border-dashed py-12"
              iconClassName="opacity-20"
            />
          )}

          {weeklyWorkouts.map((workout) => {
            const isCompleted = workout.status === 'completed';
            const isSkipped = workout.status === 'skipped';
            const dayName = DAYS[workout.dayOfWeek] || 'Day';

            let cardStyles = 'bg-card hover:border-primary/40';
            if (isCompleted) {
              cardStyles = 'bg-primary/5 border-primary/20';
            } else if (isSkipped) {
              cardStyles = 'bg-accent/30 opacity-60 grayscale';
            }

            let buttonLabel = 'Start Session';
            if (isCompleted) {
              buttonLabel = 'Review Result';
            } else if (isSkipped) {
              buttonLabel = 'Details';
            }

            const getIcon = () => {
              if (!isCompleted && !isSkipped)
                return <PlayCircle size={14} className="fill-current" />;
              if (isCompleted) return <CheckCircle2 size={14} />;
              return <Lock size={14} />;
            };

            return (
              <div
                key={workout.id}
                className={`group border-border/50 relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl ${cardStyles}`}
              >
                {/* Status Overlay for Completed */}
                {isCompleted && (
                  <div className="bg-primary/10 text-primary absolute -top-10 -right-10 flex h-24 w-24 items-end justify-start rounded-full p-4 transition-transform group-hover:scale-110">
                    <CheckCircle2 size={16} />
                  </div>
                )}

                <div>
                  {/* Day Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <p className={`${typography.mutedXs} ${isCompleted ? 'text-primary' : ''}`}>
                      {dayName}
                    </p>
                    {isSkipped && (
                      <Badge variant="inactive" className={`${typography.mutedXs}`}>
                        Skipped
                      </Badge>
                    )}
                  </div>

                  {/* Workout Info */}
                  <div className="mb-6">
                    <h4
                      className={`${typography.h4} mb-2 italic ${isSkipped ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {workout.type}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" />
                        <p className={typography.mutedXs}>{workout.durationMinutes || '45'}m</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-orange-500" />
                        <p className={typography.mutedXs}>Intensity High</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onWorkoutClick(workout.id)}
                  variant={isCompleted || isSkipped ? 'outline' : 'default'}
                  className={`w-full gap-2 rounded-2xl py-6 transition-all ${
                    !isCompleted && !isSkipped
                      ? 'shadow-[0_8px_20px_-10px_rgba(var(--primary),0.5)] active:scale-95'
                      : 'bg-background/50 border-border/50 backdrop-blur-sm'
                  }`}
                >
                  <p className={typography.pInherit}>{buttonLabel}</p>
                  {getIcon()}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
