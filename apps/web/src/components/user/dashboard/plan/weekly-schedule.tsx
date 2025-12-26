'use client';

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/common/ui-primitives/card/card';
import type { fitnessPlan } from '@bene/react-api-client';

// Extract plan type from API response
type PlanData = NonNullable<fitnessPlan.GetActivePlanResponse['plan']>;

interface WeeklyScheduleProps {
  plan: PlanData;
  onWorkoutClick: (id: string) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklySchedule({ plan, onWorkoutClick }: WeeklyScheduleProps) {
  // Get current week's workouts
  const currentWeekData = plan.weeks.find((w) => w.weekNumber === plan.currentWeek);
  const weeklyWorkouts = currentWeekData?.workouts || [];

  return (
    <Card
      title="Weekly Schedule"
      icon={Calendar}
      className="border-border/50 bg-card h-full shadow-sm"
      headerClassName="border-b border-border/50"
      headerAction={
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-full p-1.5">
            <ChevronLeft size={18} />
          </button>
          <span className="text-foreground text-sm font-medium">
            Week {plan.currentWeek} of {plan.durationWeeks}
          </span>
          <button className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-full p-1.5">
            <ChevronRight size={18} />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyWorkouts.map((workout) => {
          const isCompleted = workout.status === 'completed';
          const dayName = DAYS[workout.dayOfWeek] || 'Day';

          return (
            <div
              key={workout.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-md ${
                isCompleted
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              {/* Day Header */}
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${
                    !isCompleted ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {dayName}
                </span>
                {isCompleted && (
                  <div className="bg-primary/10 text-primary rounded-full p-1">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>

              {/* Workout Info */}
              <div className="mb-4">
                <h4 className="text-foreground mb-1 font-bold">{workout.type}</h4>
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {workout.durationMinutes ? `${workout.durationMinutes}m` : '45m'}
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
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isCompleted ? 'View Details' : 'Start Workout'}
                {!isCompleted && <PlayCircle size={14} />}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
