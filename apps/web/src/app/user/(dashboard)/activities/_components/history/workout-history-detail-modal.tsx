'use client';

import { Badge, Card, DateDisplay, IconBox, MetricCard, Modal, typography } from '@/lib/components';
import {
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
import { getActivityTypeConfig } from '@/lib/constants/training-ui';

//TODO extract out some of these components to shared for re-use

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
  if (!workout) return null;

  // Format date

  const renderExercise = (exercise: ExercisePerformance, index: number) => (
    <div
      key={index}
      className="bg-muted/30 border-border/50 mb-3 rounded-xl border p-4 last:mb-0"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`${typography.small} text-foreground font-bold`}>{exercise.name}</span>
        <Badge variant="outline" className={typography.mutedXs}>
          {exercise.setsCompleted}/{exercise.setsPlanned} Sets
        </Badge>
      </div>
      <div className={`grid grid-cols-2 gap-x-8 gap-y-2 ${typography.small} sm:grid-cols-4`}>
        {exercise.reps?.map((reps, i) => (
          <div
            key={i}
            className="border-border/40 flex items-center justify-between border-b py-1 last:border-0"
          >
            <span className={`${typography.mutedXs} mr-2 font-semibold`}>Set {i + 1}</span>
            <span className={`${typography.small} font-mono font-medium`}>
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
        {/* TODO IconBox? */}
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <Dumbbell size={16} />
        </div>
        <div>
          <h4 className={`${typography.small} text-foreground font-bold capitalize`}>
            {activity.activityType} Phase
          </h4>
          <p className={typography.mutedXs}>
            {activity.durationMinutes} minutes • {activity.completed ? 'Completed' : 'Partial'}
          </p>
        </div>
      </div>

      {activity.notes && (
        <p className={`${typography.small} text-muted-foreground pl-11 italic`}>
          &quot;{activity.notes}&quot;
        </p>
      )}

      {activity.exercises && activity.exercises.length > 0 && (
        <div className="pl-4 sm:pl-11">
          {activity.exercises.map((ex, i) => renderExercise(ex, i))}
        </div>
      )}
    </div>
  );

  // Get styling config
  const activityConfig = getActivityTypeConfig(workout.workoutType);
  const Icon = activityConfig.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={true}
      title={
        <div className="flex items-center gap-3">
           <IconBox icon={Icon} className={activityConfig.colorClass} size="md" />
           <span>{workout.title || workout.workoutType}</span>
        </div>
      }
      description={<DateDisplay date={workout.recordedAt} format="datetime" />}
    >
      <div className="no-scrollbar max-h-[85vh] overflow-y-auto sm:space-y-8 sm:p-1">
        {/* Top Stats Grid - significantly tighter on mobile */}
        <div className="grid grid-cols-2 gap-2 p-3 sm:gap-4 sm:p-0 lg:grid-cols-4">
          <MetricCard
            label="Duration"
            value={workout.performance.durationMinutes}
            unit="min"
            icon={Clock}
          />
          <MetricCard
            label="Calories"
            value={workout.performance.caloriesBurned ?? '--'}
            unit="kcal"
            icon={Flame}
          />
          <MetricCard
            label="Energy"
            value={workout.performance.energyLevel}
            icon={Activity}
            className="capitalize"
          />
          <MetricCard
            label="RPE"
            value={workout.performance.difficultyRating?.replace('_', ' ') ?? '-'}
            unit="/10"
            icon={Trophy}
          />
        </div>

        <div className="grid gap-4 p-3 pt-0 sm:gap-8 sm:p-0 lg:grid-cols-3">
          {/* Left Column: Visuals & Metadata */}
          <div className="space-y-4 sm:space-y-8 lg:col-span-1">
            {/* Heart Rate / Intensity */}
            <section className="space-y-2 sm:space-y-4">
              <h3 className={`flex items-center gap-2 ${typography.large} font-bold`}>
                <Heart size={20} className="text-rose-500" /> Heart Rate Analysis
              </h3>
              <Card className="border-border bg-card p-4 sm:p-6">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <span className={`${typography.mutedXs} font-semibold`}>Avg</span>
                    <div className={typography.h2}>
                      {workout.performance.heartRate?.average ?? '--'}{' '}
                      <span className={`${typography.muted} font-normal`}>bpm</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`${typography.mutedXs} font-semibold`}>Max</span>
                    <div className={typography.h2}>
                      {workout.performance.heartRate?.max ?? '--'}{' '}
                      <span className={`${typography.muted} font-normal`}>bpm</span>
                    </div>
                  </div>
                </div>
                {/* Placeholder Chart */}
                <div className="flex h-24 w-full items-end justify-between gap-1 opacity-80 sm:h-32">
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
              <h3 className={`flex items-center gap-2 ${typography.large} font-bold`}>
                <Info size={20} className="text-blue-500" /> Session Summary
              </h3>
              <Card className="divide-border border-border bg-card divide-y overflow-hidden">
                {workout.performance.notes && (
                  <div className="p-4">
                    <span className={`${typography.mutedXs} mb-1 block`}>Notes</span>
                    <p className={`${typography.small} text-foreground`}>
                      {workout.performance.notes}
                    </p>
                  </div>
                )}
                {workout.performance.injuries && workout.performance.injuries.length > 0 && (
                  <div className="bg-red-500/5 p-4">
                    <span
                      className={`${typography.mutedXs} mb-1 flex items-center gap-2 text-red-600`}
                    >
                      <AlertTriangle size={12} /> Injuries/Issues
                    </span>
                    <ul className={`${typography.small} text-foreground list-disc pl-4`}>
                      {workout.performance.injuries.map((injury, i) => (
                        <li key={i}>{injury}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {workout.performance.modifications &&
                  workout.performance.modifications.length > 0 && (
                    <div className="bg-orange-500/5 p-4">
                      <span className={`${typography.mutedXs} mb-1 block text-orange-600`}>
                        Modifications
                      </span>
                      <ul className={`${typography.small} text-foreground list-disc pl-4`}>
                        {workout.performance.modifications.map((mod, i) => (
                          <li key={i}>{mod}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="flex items-center justify-between p-4">
                  <span className={typography.mutedXs}>Enjoyment</span>
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
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            <h3 className={`flex items-center gap-2 ${typography.large} font-bold`}>
              <Dumbbell size={20} className={activityConfig.iconClass} /> Workout Log
            </h3>
            <Card className="border-border bg-card space-y-6 p-4 sm:space-y-8 sm:p-6">
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
    </Modal>
  );
}
