'use client';

import { useState } from 'react';
import { Dumbbell, Info } from 'lucide-react';
import { Typography, Badge } from '@/lib/components';
import type { Exercise } from '@bene/shared';
import SetTracker from './set-tracker';

interface ExerciseRowProps {
  exercise: Exercise;
  onSetComplete: (_setIndex: number, _data: any) => void;
  completedSets: any[];
}

export default function ExerciseRow({
  exercise,
  onSetComplete,
  completedSets,
}: ExerciseRowProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Dumbbell size={20} />
          </div>
          <div>
            <Typography variant="h4" className="text-lg font-black tracking-tight italic">
              {exercise.name}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase opacity-40"
              >
                Target: {exercise.sets} Sets × {exercise.reps}
              </Typography>
              {exercise.rest && (
                <Badge
                  variant="outline"
                  className="border-white/10 text-[9px] font-bold opacity-60"
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
          <Typography
            variant="muted"
            className="text-[11px] leading-relaxed font-medium italic opacity-70"
          >
            {exercise.notes}
          </Typography>
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
