'use client';

import { X, Calendar, Clock, Trophy, Flame, Activity } from 'lucide-react';
import type { CompletedWorkout } from '@bene/shared';

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: CompletedWorkout | null;
}

export default function WorkoutDetailModal({
  isOpen,
  onClose,
  workout,
}: WorkoutDetailModalProps) {
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

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <div className="bg-background animate-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl duration-200">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-6">
          <h2 className="text-foreground text-xl font-bold">Workout Details</h2>
          <button
            onClick={onClose}
            className="bg-accent text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 text-primary mb-4 flex h-20 w-20 items-center justify-center rounded-3xl">
              <Trophy size={40} />
            </div>
            <h1 className="mb-2 text-2xl font-bold">{workout.workoutType}</h1>
            <p className="text-muted-foreground font-medium tracking-wide">
              {workout.description || 'No description provided.'}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-accent/30 flex flex-col items-center justify-center rounded-2xl p-4 text-center">
              <Calendar className="text-primary mb-2" size={24} />
              <span className="text-muted-foreground text-xs uppercase">Date</span>
              <span className="font-semibold">
                <span className="font-semibold">{date}</span>
              </span>
            </div>
            <div className="bg-accent/30 flex flex-col items-center justify-center rounded-2xl p-4 text-center">
              <Clock className="text-primary mb-2" size={24} />
              <span className="text-muted-foreground text-xs uppercase">Duration</span>
              <span className="font-semibold">{workout.performance.durationMinutes} min</span>
            </div>
            <div className="bg-accent/30 flex flex-col items-center justify-center rounded-2xl p-4 text-center">
              <Flame className="text-primary mb-2" size={24} />
              <span className="text-muted-foreground text-xs uppercase">Calories</span>
              <span className="font-semibold">
                {workout.performance.caloriesBurned || '-'} kcal
              </span>
            </div>
            <div className="bg-accent/30 flex flex-col items-center justify-center rounded-2xl p-4 text-center">
              <Activity className="text-primary mb-2" size={24} />
              <span className="text-muted-foreground text-xs uppercase">Intensity</span>
              <span className="font-semibold capitalize">
                {workout.performance.difficultyRating?.replace('_', ' ') || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border bg-accent/5 flex gap-3 border-t p-6">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent hover:text-foreground w-full rounded-xl py-3 font-semibold transition-colors"
          >
            Close
          </button>
          <button className="bg-primary text-primary-foreground w-full rounded-xl py-3 font-bold transition-opacity hover:opacity-90">
            Share Result
          </button>
        </div>
      </div>
    </div>
  );
}
