'use client';

import { Timer } from 'lucide-react';
import { ProgressBar,typography } from '@/lib/components';


interface SessionHeaderProps {
  title: string;
  elapsedSeconds: number;
  currentStep: number;
  totalSteps: number;
  workoutType: string;
}

export default function SessionHeader({
  title,
  elapsedSeconds,
  currentStep,
  totalSteps,
  workoutType,
}: SessionHeaderProps) {
  return (
    <div className="bg-background/80 sticky top-0 z-50 w-full border-b border-white/5 pb-4 backdrop-blur-xl">
      <div className="container mx-auto px-6 pt-6">
        <div className="mb-4 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <p
              className={`${typography.muted} text-[10px] font-black tracking-[0.2em] uppercase opacity-50`}
            >
              Active {workoutType}
            </p>
            <h2
              className={`${typography.h2} text-3xl leading-none font-black tracking-tighter italic`}
            >
              {title}
            </h2>
          </div>

          <div className="bg-primary/10 text-primary border-primary/20 shadow-primary/10 flex items-center gap-3 rounded-2xl border px-5 py-2.5 shadow-lg">
            <Timer size={18} className="animate-pulse" />
            <h3
              className={`${typography.h3} font-mono text-2xl font-black tracking-tighter italic`}
            >
              {formatDuration(elapsedSeconds)}
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p
              className={`${typography.muted} text-[9px] font-black tracking-widest uppercase opacity-40`}
            >
              Phase Progression
            </p>
            <p className={`${typography.small} text-primary text-[10px] font-black italic`}>
              {currentStep} of {totalSteps} Complete
            </p>
          </div>
          <ProgressBar value={currentStep} max={totalSteps} size="sm" className="bg-white/5" />
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
