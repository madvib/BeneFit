'use client';

import { useState, useEffect } from 'react';
import { SkipForward } from 'lucide-react';
import { Button, Typography } from '@/lib/components';

interface RestTimerProps {
  durationSeconds: number;
  onComplete: () => void;
}

export default function RestTimer({ durationSeconds, onComplete }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const progress = (timeLeft / durationSeconds) * 100;

  return (
    <div className="bg-background/95 animate-in fade-in fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 backdrop-blur-xl duration-500">
      <div className="relative mb-12 flex h-64 w-64 items-center justify-center">
        {/* Progress Ring */}
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={754}
            strokeDashoffset={754 * (1 - progress / 100)}
            className="text-primary transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <Typography
            variant="muted"
            className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40"
          >
            Recovery Phase
          </Typography>
          <Typography
            variant="h1"
            className="font-mono text-7xl font-black tracking-tighter italic"
          >
            {timeLeft}s
          </Typography>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <Typography variant="h3" className="max-w-xs text-center text-xl font-black italic">
          Prepare for your next set. Focus on deep breathing.
        </Typography>

        <Button
          onClick={onComplete}
          variant="outline"
          className="bg-primary/10 border-primary/20 hover:bg-primary/20 gap-2 rounded-2xl px-8 py-6 text-xs font-black tracking-widest uppercase"
        >
          <SkipForward size={16} />
          Skip Rest
        </Button>
      </div>
    </div>
  );
}
