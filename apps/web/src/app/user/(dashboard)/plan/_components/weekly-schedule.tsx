'use client';

import type { fitnessPlan } from '@bene/react-api-client';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, ProgressBar } from '@/lib/components';

// Extract plan type from API response
type PlanData = NonNullable<fitnessPlan.GetActivePlanResponse['plan']>;

interface WeeklyScheduleProps {
  plan: PlanData;
  selectedWeek: number;
  onWeekChange: (_week: number) => void;
  onWorkoutClick: (_id: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklySchedule({
  plan,
  selectedWeek,
  onWeekChange,
  onWorkoutClick,
}: WeeklyScheduleProps) {
  // Get workouts for the SELECTED week, fallback to empty
  const weekData = plan.weeks.find((w) => w.weekNumber === selectedWeek);
  const weeklyWorkouts = weekData?.workouts || [];

  const handlePrevWeek = () => {
    if (selectedWeek > 1) onWeekChange(selectedWeek - 1);
  };

  const handleNextWeek = () => {
    if (selectedWeek < plan.durationWeeks) onWeekChange(selectedWeek + 1);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-primary/20 bg-primary/5';
      case 'skipped':
        return 'border-muted bg-muted/20 opacity-75';
      default:
        return 'border-border bg-card hover:border-primary/30';
    }
  };

  const getStatusTextClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'skipped':
        return 'text-muted-foreground';
      default:
        return 'text-primary';
    }
  };

  const getButtonClass = (status: string) => {
    if (status === 'completed' || status === 'skipped') {
      return 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground';
    }
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'View Results';
      case 'skipped':
        return 'View Details';
      default:
        return 'Start Workout';
    }
  };

  return (
    <Card
      title="Weekly Schedule"
      icon={Calendar}
      className="border-border/50 bg-card h-full shadow-sm"
      headerClassName="border-b border-border/50"
      headerAction={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            disabled={selectedWeek === 1}
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-full p-1.5 transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-foreground min-w-[100px] text-center text-sm font-medium">
            Week {selectedWeek} of {plan.durationWeeks}
          </span>
          <button
            onClick={handleNextWeek}
            disabled={selectedWeek === plan.durationWeeks}
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-full p-1.5 transition-colors disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Weekly Header & Stats */}
        {/* Weekly Header & Stats */}
        {weekData && (
          <div className="bg-muted/30 grid grid-cols-1 gap-4 rounded-xl p-4 sm:grid-cols-3">
            {/* Week Information */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Schedule
              </span>
              <span className="text-foreground font-semibold">Week {selectedWeek}</span>
            </div>

            {/* Workout Count */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Workouts
              </span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">
                  {weeklyWorkouts.length} Sessions
                </span>
              </div>
            </div>

            {/* Progress - Calculated */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Progress
                </span>
                <span className="text-muted-foreground text-xs">
                  {weeklyWorkouts.filter((w) => w.status === 'completed').length} /{' '}
                  {weeklyWorkouts.length} workouts
                </span>
              </div>
              <ProgressBar
                value={weeklyWorkouts.filter((w) => w.status === 'completed').length}
                max={weeklyWorkouts.length || 1}
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Workouts Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {weeklyWorkouts.length === 0 && (
            <div className="text-muted-foreground col-span-full py-8 text-center text-sm">
              No workouts scheduled for this week.
            </div>
          )}

          {weeklyWorkouts.map((workout) => {
            const isCompleted = workout.status === 'completed';
            const isSkipped = workout.status === 'skipped';
            const dayName = DAYS[workout.dayOfWeek] || 'Day';

            return (
              <div
                key={workout.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-md ${getStatusClasses(
                  workout.status,
                )}`}
              >
                {/* Day Header */}
                <div className="mb-3 flex items-center justify-between">
                  <span className={`text-sm font-bold ${getStatusTextClass(workout.status)}`}>
                    {dayName}
                  </span>
                  {isCompleted && (
                    <div className="bg-primary/10 text-primary rounded-full p-1">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                  {isSkipped && (
                    <div className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                      Skipped
                    </div>
                  )}
                </div>

                {/* Workout Info */}
                <div className="mb-4">
                  <h4
                    className={`mb-1 font-bold ${
                      isSkipped ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {workout.type}
                  </h4>
                  <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {workout.durationMinutes ? `${workout.durationMinutes}m` : '45m'}
                      Aurora
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={12} />
                      {workout.status}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onWorkoutClick(workout.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-colors ${getButtonClass(
                    workout.status,
                  )}`}
                >
                  {getButtonText(workout.status)}
                  {!isCompleted && !isSkipped && <PlayCircle size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
