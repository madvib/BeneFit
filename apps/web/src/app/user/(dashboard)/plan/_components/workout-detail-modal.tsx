'use client';

import { useEscapeKey } from '@/lib/hooks/use-escape-key';
import { X, Clock, Zap, PlayCircle, SkipForward, BarChart2, Star } from 'lucide-react';
import { Button, Typography, Badge, Card } from '@/lib/components';
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
  // Close on Escape key
  useEscapeKey(onClose, isOpen);

  if (!workout || !isOpen) return null;

  const isCompleted = workout.status === 'completed';
  const isSkipped = workout.status === 'skipped';

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background ring-border/50 animate-in zoom-in-95 relative m-4 flex w-full max-w-md flex-col overflow-hidden rounded-3xl p-6 shadow-2xl ring-1 duration-300">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-tighter uppercase"
              >
                {workout.type}
              </Badge>
              {isCompleted && (
                <Badge
                  variant="success"
                  className="text-[10px] font-black tracking-tighter uppercase"
                >
                  Completed
                </Badge>
              )}
              {isSkipped && (
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground text-[10px] font-black tracking-tighter uppercase"
                >
                  Skipped
                </Badge>
              )}
            </div>
            <Typography
              variant="h2"
              className="text-2xl leading-none font-black tracking-tighter italic sm:text-3xl"
            >
              {workout.type} Session
            </Typography>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-2">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                <Clock size={14} className="text-primary" /> Duration
              </div>
              <Typography variant="h3" className="font-black italic">
                {workout.durationMinutes || 45}
                <span className="text-muted-foreground ml-1 text-sm not-italic">min</span>
              </Typography>
            </div>
            <div className="flex flex-col gap-1 p-2">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                <Zap size={14} className="text-orange-500" /> Intensity
              </div>
              <Typography variant="h3" className="font-black italic">
                High
              </Typography>
            </div>
          </div>

          {/* Intent Section */}
          <Card className="bg-muted/30 border-none shadow-none">
            <div className="flex items-start gap-3 p-4">
              <div className="bg-primary/20 text-primary mt-0.5 rounded-lg p-1.5">
                <Star size={14} />
              </div>
              <div>
                <Typography
                  variant="muted"
                  className="mb-1 text-[10px] font-black tracking-widest uppercase"
                >
                  Session Intent
                </Typography>
                <Typography variant="small" className="text-foreground/90 font-medium">
                  Focus on hypertrophy & explosive power retention.
                </Typography>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="mt-2 flex flex-col gap-3">
            {!isCompleted && !isSkipped && (
              <>
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl py-6 text-sm font-black tracking-widest uppercase"
                  onClick={() => onStart(workout.id)}
                  isLoading={isStarting}
                >
                  <PlayCircle size={18} className="fill-current" />
                  Start Session
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground w-full gap-2 text-xs font-black tracking-widest uppercase"
                  onClick={() => onSkip(workout.id)}
                  isLoading={isSkipping}
                >
                  <SkipForward size={16} />
                  Skip this session
                </Button>
              </>
            )}

            {isCompleted && (
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 rounded-xl py-6"
                onClick={onClose}
              >
                <BarChart2 size={18} />
                View Performance
              </Button>
            )}

            {isSkipped && (
              <Button
                variant="default"
                size="lg"
                className="w-full gap-2 rounded-xl py-6 font-black uppercase"
                onClick={() => onStart(workout.id)}
                isLoading={isStarting}
              >
                <PlayCircle size={18} className="fill-current" />
                Do it anyway
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
