'use client';

import { useEscapeKey } from '@/lib/hooks/use-escape-key';
import {
  X,
  Clock,
  Flame,
  Activity,
  Trophy,
  Heart,
  Info,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import type { CompletedWorkout, ActivityPerformance, ExercisePerformance } from '@bene/shared';
import { Badge, Button, Card } from '@/lib/components';

interface WorkoutHistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: CompletedWorkout | null;
}

export function WorkoutHistoryDetailModal({
  isOpen,
  onClose,
  workout,
}: WorkoutHistoryDetailModalProps) {
  // Close on Escape key
  useEscapeKey(onClose, isOpen);

  if (!isOpen || !workout) return null;

  // Format date
  const date = new Date(workout.recordedAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const renderExercise = (exercise: ExercisePerformance, index: number) => (
    <div
      key={index}
      className="bg-muted/30 border-border/50 mb-3 rounded-xl border p-4 last:mb-0"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-foreground font-bold">{exercise.name}</span>
        <Badge variant="outline" className="text-xs">
          {exercise.setsCompleted}/{exercise.setsPlanned} Sets
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
        {exercise.reps?.map((reps, i) => (
          <div
            key={i}
            className="border-border/40 flex items-center justify-between border-b py-1 last:border-0"
          >
            <span className="text-muted-foreground mr-2 text-xs font-semibold uppercase">
              Set {i + 1}
            </span>
            <span className="font-mono font-medium">
              {reps} x {exercise.weight?.[i] ?? 0}kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = (activity: ActivityPerformance, index: number) => (
    <div key={index} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <Dumbbell size={16} />
        </div>
        <div>
          <h4 className="text-foreground font-bold capitalize">{activity.activityType} Phase</h4>
          <p className="text-muted-foreground text-xs">
            {activity.durationMinutes} minutes • {activity.completed ? 'Completed' : 'Partial'}
          </p>
        </div>
      </div>

      {activity.notes && (
        <p className="text-muted-foreground pl-11 text-sm italic">&quot;{activity.notes}&quot;</p>
      )}

      {activity.exercises && activity.exercises.length > 0 && (
        <div className="pl-4 sm:pl-11">
          {activity.exercises.map((ex, i) => renderExercise(ex, i))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-background animate-in fade-in fixed inset-0 z-[100] flex flex-col duration-200">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-4 px-6 md:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={24} />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-xl font-bold md:text-2xl">
                {workout.workoutType}
              </h1>
              <Badge variant="success" className="h-5">
                Complete
              </Badge>
            </div>
            <span className="text-muted-foreground text-sm">{date}</span>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">{/* Optional Header Actions */}</div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card bodyClassName="p-4 flex flex-col gap-1" className="border-border bg-card">
              <div className="text-muted-foreground flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">Duration</span>
              </div>
              <div className="text-foreground text-2xl font-bold">
                {workout.performance.durationMinutes}{' '}
                <span className="text-muted-foreground text-sm font-normal">min</span>
              </div>
            </Card>
            <Card bodyClassName="p-4 flex flex-col gap-1" className="border-border bg-card">
              <div className="text-muted-foreground flex items-center gap-2">
                <Flame size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">Calories</span>
              </div>
              <div className="text-foreground text-2xl font-bold">
                {workout.performance.caloriesBurned ?? '--'}{' '}
                <span className="text-muted-foreground text-sm font-normal">kcal</span>
              </div>
            </Card>
            <Card bodyClassName="p-4 flex flex-col gap-1" className="border-border bg-card">
              <div className="text-muted-foreground flex items-center gap-2">
                <Activity size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">Energy</span>
              </div>
              <div className="text-foreground text-2xl font-bold capitalize">
                {workout.performance.energyLevel}
              </div>
            </Card>
            <Card bodyClassName="p-4 flex flex-col gap-1" className="border-border bg-card">
              <div className="text-muted-foreground flex items-center gap-2">
                <Trophy size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">RPE</span>
              </div>
              <div className="text-foreground text-2xl font-bold">
                {workout.performance.difficultyRating?.replace('_', ' ') ?? '-'}{' '}
                <span className="text-muted-foreground text-sm font-normal">/10</span>
              </div>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Visuals & Metadata */}
            <div className="space-y-8 lg:col-span-1">
              {/* Heart Rate / Intensity */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Heart size={20} className="text-rose-500" /> Heart Rate Analysis
                </h3>
                <Card className="border-border bg-card p-6">
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <span className="text-muted-foreground text-sm font-semibold uppercase">
                        Avg
                      </span>
                      <div className="text-2xl font-bold">
                        {workout.performance.heartRate?.average ?? '--'}{' '}
                        <span className="text-muted-foreground text-sm font-normal">bpm</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground text-sm font-semibold uppercase">
                        Max
                      </span>
                      <div className="text-2xl font-bold">
                        {workout.performance.heartRate?.max ?? '--'}{' '}
                        <span className="text-muted-foreground text-sm font-normal">bpm</span>
                      </div>
                    </div>
                  </div>
                  {/* Placeholder Chart - would be real chart with real data */}
                  <div className="flex h-32 w-full items-end justify-between gap-1 opacity-80">
                    {[30, 45, 60, 75, 50, 65, 80, 55, 40, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-full rounded-t-sm bg-rose-500"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </Card>
              </section>

              {/* Session Notes & Feedback */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Info size={20} className="text-blue-500" /> Session Summary
                </h3>
                <Card className="divide-border border-border bg-card divide-y overflow-hidden">
                  {workout.performance.notes && (
                    <div className="p-4">
                      <span className="text-muted-foreground mb-1 block text-xs font-bold uppercase">
                        Notes
                      </span>
                      <p className="text-foreground text-sm">{workout.performance.notes}</p>
                    </div>
                  )}
                  {workout.performance.injuries && workout.performance.injuries.length > 0 && (
                    <div className="bg-red-500/5 p-4">
                      <span className="mb-1 flex items-center gap-2 text-xs font-bold text-red-600 uppercase">
                        <AlertTriangle size={12} /> Injuries/Issues
                      </span>
                      <ul className="text-foreground list-disc pl-4 text-sm">
                        {workout.performance.injuries.map((injury, i) => (
                          <li key={i}>{injury}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {workout.performance.modifications &&
                    workout.performance.modifications.length > 0 && (
                      <div className="bg-orange-500/5 p-4">
                        <span className="mb-1 block text-xs font-bold text-orange-600 uppercase">
                          Modifications
                        </span>
                        <ul className="text-foreground list-disc pl-4 text-sm">
                          {workout.performance.modifications.map((mod, i) => (
                            <li key={i}>{mod}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <div className="flex items-center justify-between p-4">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Enjoyment
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <CheckCircle2
                          key={star}
                          size={16}
                          className={
                            star <= workout.performance.enjoyment
                              ? 'text-primary fill-primary/20'
                              : 'text-border'
                          }
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </section>
            </div>

            {/* Right Column: Activity Breakdown */}
            <div className="space-y-6 lg:col-span-2">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Dumbbell size={20} className="text-primary" /> Workout Log
              </h3>
              <Card className="border-border bg-card space-y-8 p-6">
                {workout.performance.activities.map((activity, index) =>
                  renderActivity(activity, index),
                )}
                {workout.performance.activities.length === 0 && (
                  <div className="text-muted-foreground py-12 text-center">
                    No detailed activity logs available for this session.
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
