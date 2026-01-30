import { useState, useEffect } from 'react';
import { SkipForward } from 'lucide-react';
import { Button, typography } from '@/lib/components';

interface RestTimerProps {
  durationSeconds: number;
  onComplete: () => void;
}

export function RestTimer({ durationSeconds, onComplete }: Readonly<RestTimerProps>) {
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
    <div className="bg-background/95 animate-in fade-in fixed inset-0 z-100 flex flex-col items-center justify-center p-6 backdrop-blur-xl duration-500">
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
          <p className={`${typography.mutedXs} opacity-40`}>Recovery Phase</p>
          <h1 className={`${typography.displayLg} font-mono italic`}>{timeLeft}s</h1>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <h3 className={`${typography.h4} max-w-xs text-center italic`}>
          Prepare for your next set. Focus on deep breathing.
        </h3>

        <Button
          onClick={onComplete}
          variant="outline"
          className={`${typography.labelXs} bg-primary/10 border-primary/20 hover:bg-primary/20 gap-2 rounded-2xl px-8 py-6`}
        >
          <SkipForward size={16} />
          Skip Rest
        </Button>
      </div>
    </div>
  );
}
