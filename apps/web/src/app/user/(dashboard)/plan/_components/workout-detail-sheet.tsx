'use client';

import { CheckCircle2, Clock, Dumbbell, Target, AlertCircle, Lightbulb, X } from 'lucide-react';
import type { WorkoutTemplate } from '@bene/shared';
import { Badge } from '@/lib/components/ui-primitives/badges/badge';
import { Card } from '@/lib/components/ui-primitives/card/card';

interface WorkoutDetailSheetProps {
  workout: WorkoutTemplate;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

const importanceConfig = {
  optional: { variant: 'secondary' as const, label: 'Optional' },
  recommended: { variant: 'default' as const, label: 'Recommended' },
  key: { variant: 'success' as const, label: 'Key Workout' },
  critical: { variant: 'error' as const, label: 'Critical' },
};

const categoryIcons = {
  cardio: Clock,
  strength: Dumbbell,
  recovery: Target,
};

export function WorkoutDetailSheet({ workout, open, onOpenChange }: WorkoutDetailSheetProps) {
  if (!open) return null;

  const importanceStyle = importanceConfig[workout.importance];
  const CategoryIcon = categoryIcons[workout.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background relative m-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-background border-muted sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-6 py-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{workout.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {workout.type} • Day {workout.dayOfWeek + 1}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={importanceStyle.variant}>{importanceStyle.label}</Badge>
            <Badge variant="outline" icon={CategoryIcon}>
              {workout.category}
            </Badge>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Workout Goals */}
          {workout.goals && (
            <Card title="Goals" icon={Target} variant="borderless">
              <div className="space-y-2">
                {workout.goals.volume && (
                  <div className="bg-muted flex justify-between rounded-md p-3 text-sm">
                    <span>Volume Target</span>
                    <span className="font-medium">
                      {workout.goals.volume.totalSets} sets × {workout.goals.volume.totalReps}{' '}
                      reps
                    </span>
                  </div>
                )}
                {workout.goals.distance && (
                  <div className="bg-muted flex justify-between rounded-md p-3 text-sm">
                    <span>Distance</span>
                    <span className="font-medium">
                      {workout.goals.distance.value} {workout.goals.distance.unit}
                    </span>
                  </div>
                )}
                {workout.goals.duration && (
                  <div className="bg-muted flex justify-between rounded-md p-3 text-sm">
                    <span>Duration</span>
                    <span className="font-medium">{workout.goals.duration.value} min</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Activities */}
          <Card title="Activities" icon={Dumbbell} variant="borderless">
            <div className="space-y-4">
              {workout.activities.map((activity, idx) => (
                <div key={idx} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{activity.name}</h4>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>

                  {/* Exercise Structure */}
                  {activity.structure?.exercises && (
                    <div className="space-y-2">
                      {activity.structure.exercises.map((exercise, exIdx) => (
                        <div key={exIdx} className="bg-muted rounded-md p-3 text-sm">
                          <div className="mb-1 font-medium">{exercise.name}</div>
                          <div className="text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                            {exercise.rest && ` • ${exercise.rest}s rest`}
                          </div>
                          {exercise.notes && (
                            <div className="text-muted-foreground mt-1 text-xs italic">
                              {exercise.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Instructions */}
                  {activity.instructions && activity.instructions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Instructions:</div>
                      <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
                        {activity.instructions.map((instruction, instIdx) => (
                          <li key={instIdx}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Alternative Exercises */}
                  {activity.alternativeExercises && activity.alternativeExercises.length > 0 && (
                    <div className="text-muted-foreground text-xs">
                      <span className="font-medium">Alternatives:</span>{' '}
                      {activity.alternativeExercises.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Coach Notes */}
          {workout.coachNotes && (
            <Card title="Coach Notes" icon={Lightbulb} variant="borderless">
              <div className="bg-primary/5 border-primary rounded-md border-l-4 p-4">
                <p className="text-sm leading-relaxed">{workout.coachNotes}</p>
              </div>
            </Card>
          )}

          {/* Alternatives */}
          {workout.alternatives && workout.alternatives.length > 0 && (
            <Card title="Alternative Workouts" icon={AlertCircle} variant="borderless">
              <div className="space-y-3">
                {workout.alternatives.map((alt, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="mb-2 text-sm font-medium">{alt.reason}</div>
                    <div className="space-y-2">
                      {alt.activities.map((activity, actIdx) => (
                        <div key={actIdx} className="text-muted-foreground text-sm">
                          • {activity.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Status */}
          {workout.status === 'completed' && workout.completedWorkoutId && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4" />
              <span>Workout completed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
