'use client';

import { Badge, IconBox, typography } from '@/lib/components';
import { Dumbbell, Info } from 'lucide-react';
import type { Exercise } from '@bene/react-api-client';
import {SetTracker} from './set-tracker';

interface SetPerformanceData {
  reps: number;
  weight: number;
  rpe?: number;
}

interface ExerciseRowProps {
  exercise: Exercise;
  onSetComplete: (_setIndex: number, _data: SetPerformanceData) => void;
  completedSets: SetPerformanceData[];
}

export function ExerciseRow({
  exercise,
  onSetComplete,
  completedSets,
}: Readonly<ExerciseRowProps>) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconBox icon={Dumbbell} variant="default" size="md" className="rounded-xl" />
          <div>
            <h4 className={typography.h4}>{exercise.name}</h4>
            <div className="flex items-center gap-2">
              <p className={typography.labelXs}>
                Target: {exercise.sets} Sets × {exercise.reps}
              </p>
              {exercise.rest && (
                <Badge
                  variant="outline"
                  className={`${typography.labelXs} border-white/10 opacity-60`}
                >
                  {exercise.rest}s Rest
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {exercise.notes && (
        <div className="bg-primary/5 flex items-start gap-2 rounded-xl p-3">
          <Info size={14} className="text-primary mt-0.5 opacity-60" />
          <p className={typography.mutedXs}>{exercise.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <SetTracker
            key={i}
            setNumber={i + 1}
            plannedReps={exercise.reps}
            plannedWeight={exercise.weight}
            isCompleted={!!completedSets[i]}
            onComplete={(data) => onSetComplete(i, data)}
          />
        ))}
      </div>
    </div>
  );
}
