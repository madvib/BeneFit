

import { Calendar } from 'lucide-react';
import { 
  Card, 
  Button, 
  IconBox, 
  typography 
} from '@/lib/components';

interface RestDayViewProps {
  readonly onViewSchedule?: () => void;
  readonly onBrowseRecovery?: () => void;
}

export function RestDayView({ onViewSchedule, onBrowseRecovery }: RestDayViewProps) {
  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center p-6">
      {/* Ambient Background blobs preserved from TodayView */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="animation-delay-2000 animate-blob absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="animation-delay-4000 animate-blob absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      <Card className="border-primary/10 bg-background/60 flex max-w-md flex-col items-center border p-12 text-center shadow-2xl backdrop-blur-xl">
        <IconBox
          icon={Calendar}
          variant="ghost"
          className="bg-primary/5 animate-bounce-slow ring-primary/20 mb-8 h-24 w-24 rounded-full ring-1"
          iconClassName="text-primary opacity-80 h-12 w-12"
        />

        <h2 className={`${typography.h2} mb-3`}>Rest & Recovery</h2>

        <p className={`${typography.muted} mb-8 max-w-70`}>
          No workout specifically assigned for today. Take this time to recharge your energy for
          the next session.
        </p>

        <div className="w-full space-y-3">
          <Button
            variant="outline"
            onClick={onViewSchedule}
            className={`${typography.p} border-primary/20 hover:bg-primary/5 h-12 w-full rounded-xl`}
          >
            View Weeks Schedule
          </Button>
          <Button
            variant="ghost"
            onClick={onBrowseRecovery}
            className={`${typography.labelXs} text-muted-foreground hover:text-primary w-full rounded-xl`}
          >
            Browse Active Recovery Sessions
          </Button>
        </div>
      </Card>
    </div>
  );
}
