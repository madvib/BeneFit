'use client';

import { Check, Scale, Repeat } from 'lucide-react';
import { Button, Typography } from '@/lib/components';
import { useState } from 'react';

interface SetTrackerProps {
  setNumber: number;
  plannedReps: number | string;
  plannedWeight?: number;
  onComplete: (_data: { reps: number; weight: number; rpe?: number }) => void;
  isCompleted?: boolean;
}

export default function SetTracker({
  setNumber,
  plannedReps,
  plannedWeight,
  onComplete,
  isCompleted = false,
}: SetTrackerProps) {
  const [reps, setReps] = useState(typeof plannedReps === 'number' ? plannedReps.toString() : '');
  const [weight, setWeight] = useState(plannedWeight?.toString() || '');

  const handleComplete = () => {
    onComplete({
      reps: Number.parseInt(reps) || 0,
      weight: Number.parseFloat(weight) || 0,
    });
  };

  return (
    <div
      className={`group flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all duration-300 ${
        isCompleted
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black italic ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-white/10 text-white/40'
          }`}
        >
          {setNumber}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Repeat size={12} className="text-white/30" />
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-12 bg-transparent text-sm font-black tracking-tight outline-none"
                placeholder="0"
                disabled={isCompleted}
              />
            </div>
            <Typography variant="muted" className="text-[9px] font-bold uppercase opacity-30">
              Reps
            </Typography>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Scale size={12} className="text-white/30" />
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-12 bg-transparent text-sm font-black tracking-tight outline-none"
                placeholder="0"
                disabled={isCompleted}
              />
            </div>
            <Typography variant="muted" className="text-[9px] font-bold uppercase opacity-30">
              Weight (kg)
            </Typography>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        variant={isCompleted ? 'success' : 'default'}
        onClick={handleComplete}
        className={`h-10 w-10 rounded-xl p-0 transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
      >
        {isCompleted ? (
          <Check size={18} />
        ) : (
          <div className="text-[10px] font-black italic">SET</div>
        )}
      </Button>
    </div>
  );
}
