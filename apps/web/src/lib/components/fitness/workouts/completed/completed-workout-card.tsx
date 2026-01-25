'use client';

import { Badge, Button, IconBox, typography } from '@/lib/components';
import { CheckCircle2, Clock, Dumbbell, Activity, LucideIcon } from 'lucide-react';
import type { CompletedWorkout } from '@bene/react-api-client';

interface CompletedWorkoutCardProps {
  workout: CompletedWorkout;
  Icon: LucideIcon;
}

export function CompletedWorkoutCard({ workout, Icon }: CompletedWorkoutCardProps) {
  const { performance } = workout;
  
  return (
    <div className="group relative overflow-hidden bg-primary/5 border border-primary/20 rounded-3xl p-6 hover:shadow-lg transition-all flex flex-col justify-between h-full">
      {/* Status indicator */}
      <div className="bg-primary/10 text-primary absolute -top-8 -right-8 flex h-20 w-20 items-end justify-start rounded-full p-4 transition-transform group-hover:scale-110">
        <CheckCircle2 size={16} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <IconBox icon={Icon} size="md" variant="muted" className="rounded-xl ring-1 ring-border/50 bg-background" />
           <div>
              <h4 className={`${typography.h4} capitalize tracking-tight`}>{workout.title || workout.workoutType}</h4>
              <p className={`${typography.mutedXs} opacity-60`}>
                 {workout.recordedAt ? new Date(workout.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Completed'}
              </p>
           </div>
        </div>

        <div className="flex flex-wrap gap-3">
           <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-primary" />
              <p className={typography.mutedXs}>{performance.durationMinutes}m</p>
           </div>
           <div className="flex items-center gap-1.5">
              <Dumbbell size={12} className="text-muted-foreground" />
              <p className={typography.mutedXs}>{performance.totalVolume}kg</p>
           </div>
           <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-success" />
              <p className={typography.mutedXs}>{performance.energyLevel}</p>
           </div>
        </div>
      </div>

      <Button 
        variant="outline" 
        className={`w-full gap-2 rounded-xl mt-6 py-5 bg-background/50 border-border/50 backdrop-blur-sm ${typography.smallInherit}`}
      >
        Review Result
        <CheckCircle2 size={14} />
      </Button>
    </div>
  );
}
