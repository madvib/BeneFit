'use client';

import * as React from 'react';
import { X, Clock, Zap, PlayCircle, SkipForward, BarChart2 } from 'lucide-react';
import { Button } from '@/lib/components';
import { fitnessPlan } from '@bene/react-api-client';

// Extract types
type PlanData = NonNullable<fitnessPlan.GetActivePlanResponse['plan']>;
type Week = PlanData['weeks'][number];
type Workout = Week['workouts'][number];

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout | null;
  onStart: (_id: string) => void;
  onSkip: (_id: string) => void;
  isStarting?: boolean;
  isSkipping?: boolean;
}

export default function WorkoutDetailModal({
  isOpen,
  onClose,
  workout,
  onStart,
  onSkip,
  isStarting,
  isSkipping,
}: WorkoutDetailModalProps) {
  if (!isOpen || !workout) return null;

  const isCompleted = workout.status === 'completed';
  const isSkipped = workout.status === 'skipped';

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200">
      <div className="bg-background animate-in zoom-in-95 relative w-full max-w-md rounded-3xl p-6 shadow-xl duration-200">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
                {workout.type}
              </span>
              {isCompleted && (
                <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold tracking-wide text-green-500 uppercase">
                  Completed
                </span>
              )}
              {isSkipped && (
                <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
                  Skipped
                </span>
              )}
            </div>
            <h2 className="text-foreground mt-2 text-2xl font-bold">{workout.type} Session</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
              <Clock size={14} /> Duration
            </div>
            <div className="text-foreground text-lg font-bold">
              {workout.durationMinutes || 45} min
            </div>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
              <Zap size={14} /> Intensity
            </div>
            <div className="text-foreground text-lg font-bold">Moderate</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!isCompleted && !isSkipped && (
            <>
              <Button
                size="lg"
                className="w-full gap-2 rounded-xl text-base"
                onClick={() => onStart(workout.id)}
                isLoading={isStarting}
              >
                <PlayCircle size={20} />
                Start Workout
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground w-full gap-2 rounded-xl text-base"
                onClick={() => onSkip(workout.id)}
                isLoading={isSkipping}
              >
                <SkipForward size={20} />
                Skip this session
              </Button>
            </>
          )}

          {isCompleted && (
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 rounded-xl text-base"
              onClick={onClose} // Todo: Navigate to results
            >
              <BarChart2 size={20} />
              View Performance
            </Button>
          )}

          {isSkipped && (
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 rounded-xl text-base"
              onClick={() => onStart(workout.id)} // Allow retrying/undoing skip
              isLoading={isStarting}
            >
              <PlayCircle size={20} />
              Do it anyway
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
