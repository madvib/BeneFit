'use client';

import { Card, Badge,typography } from '@/lib/components';
import { Play, CheckCircle2, Lock } from 'lucide-react';
import type { WorkoutActivity } from '@bene/shared';
import ExerciseRow from './exercise-row';


interface ActivityPhaseProps {
  activity: WorkoutActivity;
  isActive: boolean;
  isCompleted: boolean;
  onSetComplete: (_exerciseIndex: number, _setIndex: number, _data: any) => void;
  completedExercises: any[][];
}

export default function ActivityPhase({
  activity,
  isActive,
  isCompleted,
  onSetComplete,
  completedExercises,
}: ActivityPhaseProps) {
  return (
    <Card
      variant={isActive ? 'default' : 'ghost'}
      className={`relative overflow-hidden transition-all duration-500 ${
        isActive ? 'ring-primary/20 scale-100 shadow-2xl ring-4' : 'scale-[0.98] opacity-50'
      } ${isCompleted ? 'bg-emerald-500/5' : ''}`}
    >
      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isActive
                    ? 'bg-primary/20 text-primary animate-pulse'
                    : 'bg-white/5 text-white/20'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={24} />
              ) : isActive ? (
                <Play size={22} className="fill-current" />
              ) : (
                <Lock size={20} />
              )}
            </div>
            <div>
              <h3
                className={`${typography.h3} ${isCompleted ? 'text-emerald-500/70 line-through' : ''}`}
              >
                {activity.name}
              </h3>
              <p className={typography.labelXs}>
                {activity.type} Protocol • {activity.duration || 0}m Target
              </p>
            </div>
          </div>

          {isActive && (
            <Badge
              variant="outline"
              className={`${typography.labelXs} border-primary/20 text-primary animate-pulse italic`}
            >
              LIVE PHASE
            </Badge>
          )}
        </div>

        {activity.instructions && activity.instructions.length > 0 && isActive && (
          <div className="bg-primary/5 border-primary mb-8 rounded-r-xl border-l-4 p-4">
            <p className={`${typography.small} text-foreground/80 leading-relaxed italic`}>
              &ldquo;{activity.instructions[0]}&rdquo;
            </p>
          </div>
        )}

        {activity.structure?.exercises && (
          <div className="space-y-10">
            {activity.structure.exercises.map((ex, idx) => (
              <ExerciseRow
                key={idx}
                exercise={ex}
                completedSets={completedExercises[idx] || []}
                onSetComplete={(setIdx, data) => onSetComplete(idx, setIdx, data)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
