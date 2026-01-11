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
  Lock,
} from 'lucide-react';
import { Card, ProgressBar, Typography, Badge, Button } from '@/lib/components';

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
          <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Calendar size={20} />
          </div>
          <div>
            <Typography variant="h3" className="font-black tracking-tighter uppercase italic">
              Training Schedule
            </Typography>
            <Typography
              variant="muted"
              className="text-[10px] font-black tracking-widest uppercase"
            >
              Weekly Overview
            </Typography>
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
          <Typography variant="small" className="min-w-[100px] text-center font-black">
            Week {selectedWeek} of {plan.durationWeeks}
          </Typography>
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
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase"
              >
                Focus Phase
              </Typography>
              <Typography variant="small" className="font-black italic">
                Strength & Power Building
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase"
              >
                Commitment
              </Typography>
              <Typography variant="small" className="font-black">
                {weeklyWorkouts.length} Sessions Planned
              </Typography>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Typography
                  variant="muted"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Week Progress
                </Typography>
                <Typography variant="small" className="text-primary font-black italic">
                  {weeklyWorkouts.filter((w) => w.status === 'completed').length} /{' '}
                  {weeklyWorkouts.length}
                </Typography>
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
            <div className="bg-accent/20 border-border/50 col-span-full rounded-2xl border border-dashed py-12 text-center">
              <Typography variant="muted" className="italic">
                No sessions drafted for this week yet.
              </Typography>
            </div>
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
                    <Typography
                      variant="muted"
                      className={`text-[10px] font-black tracking-widest uppercase ${isCompleted ? 'text-primary' : ''}`}
                    >
                      {dayName}
                    </Typography>
                    {isSkipped && (
                      <Badge
                        variant="inactive"
                        className="text-[8px] leading-none font-black tracking-widest uppercase"
                      >
                        Skipped
                      </Badge>
                    )}
                  </div>

                  {/* Workout Info */}
                  <div className="mb-6">
                    <Typography
                      variant="h4"
                      className={`mb-2 leading-tight font-black italic ${isSkipped ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {workout.type}
                    </Typography>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" />
                        <Typography variant="muted" className="text-[10px] font-bold">
                          {workout.durationMinutes || '45'}m
                        </Typography>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-orange-500" />
                        <Typography variant="muted" className="text-[10px] font-bold">
                          Intensity High
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onWorkoutClick(workout.id)}
                  variant={isCompleted || isSkipped ? 'outline' : 'default'}
                  className={`w-full gap-2 rounded-2xl py-6 font-black tracking-widest uppercase transition-all ${
                    !isCompleted && !isSkipped
                      ? 'shadow-[0_8px_20px_-10px_rgba(var(--primary),0.5)] active:scale-95'
                      : 'bg-background/50 border-border/50 backdrop-blur-sm'
                  }`}
                >
                  <Typography variant="small" className="font-black">
                    {buttonLabel}
                  </Typography>
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
