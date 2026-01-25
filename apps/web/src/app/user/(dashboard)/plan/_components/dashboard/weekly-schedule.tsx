'use client';

import { Badge, Button, Card, EmptyState, IconBox, ProgressBar, typography, ScheduledWorkoutView } from '@/lib/components';
import { type FitnessPlan as PlanData, type DailyWorkout } from '@bene/react-api-client';
import { VALID_DAYS } from '@bene/shared';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface WeeklyScheduleProps {
  plan: PlanData;
  selectedWeek: number;
  onWeekChange: (_week: number) => void;
  onWorkoutClick: (_id: string) => void;
}



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
    if (selectedWeek < plan.weeks.length) onWeekChange(selectedWeek + 1);
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
            Week {selectedWeek} of {plan.weeks.length}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextWeek}
            disabled={selectedWeek === plan.weeks.length}
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

          {weeklyWorkouts.map((workout) => (
            <ScheduledWorkoutView
              key={workout.id}
              workout={workout as unknown as DailyWorkout}
              layout="card"
              status={workout.status as any}
              subHeader={VALID_DAYS[workout.dayOfWeek]}
              onStart={() => onWorkoutClick(workout.id)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
