'use client';

import { Card, Typography, Badge } from '@/lib/components';
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
  const status = isCompleted ? 'completed' : isActive ? 'active' : 'locked';

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
              <Typography
                variant="h3"
                className={`text-xl font-black tracking-tight italic ${isCompleted ? 'text-emerald-500/70 line-through' : ''}`}
              >
                {activity.name}
              </Typography>
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase opacity-40"
              >
                {activity.type} Protocol • {activity.duration || 0}m Target
              </Typography>
            </div>
          </div>

          {isActive && (
            <Badge
              variant="outline"
              className="border-primary/20 text-primary animate-pulse text-[10px] font-black italic"
            >
              LIVE PHASE
            </Badge>
          )}
        </div>

        {activity.instructions && activity.instructions.length > 0 && isActive && (
          <div className="bg-primary/5 border-primary mb-8 rounded-r-xl border-l-4 p-4">
            <Typography
              variant="small"
              className="text-foreground/80 text-xs leading-relaxed font-bold italic"
            >
              &ldquo;{activity.instructions[0]}&rdquo;
            </Typography>
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
