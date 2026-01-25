'use client';

import { Badge, Button, IconBox, typography } from '@/lib/components';
import { Play, Clock, Zap, CheckCircle2, ChevronRight, LucideIcon } from 'lucide-react';
import type { DailyWorkout } from '@bene/react-api-client';

interface ScheduledWorkoutCardProps {
  workout: DailyWorkout;
  status: 'scheduled' | 'completed' | 'skipped';
  subHeader?: string;
  onStart?: () => void;
  Icon: LucideIcon;
  typeConfig: { colorClass: string };
  layout?: 'card' | 'inline';
}

export function ScheduledWorkoutCard({
  workout,
  status,
  subHeader,
  onStart,
  Icon,
  typeConfig,
  layout = 'card'
}: ScheduledWorkoutCardProps) {
  const isInline = layout === 'inline';
  const isCompleted = status === 'completed';
  const isSkipped = status === 'skipped';

  return (
    <div className={`group relative overflow-hidden bg-card/40 border border-border/40 rounded-3xl p-6 hover:border-primary/50 transition-all hover:shadow-lg backdrop-blur-sm flex flex-col justify-between ${isInline ? '' : 'h-full'} ${isCompleted ? 'bg-primary/5 border-primary/20' : ''} ${isSkipped ? 'bg-accent/30 opacity-60 grayscale' : ''}`}>
      {/* Status Overlay for Completed */}
      {isCompleted && !isInline && (
        <div className="bg-primary/10 text-primary absolute -top-10 -right-10 flex h-24 w-24 items-end justify-start rounded-full p-4 transition-transform group-hover:scale-110">
          <CheckCircle2 size={16} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IconBox icon={Icon} size="md" variant="muted" className="rounded-xl ring-1 ring-border/50" />
            <div>
              {subHeader && (
                <p className={`${typography.mutedXs} ${isCompleted ? 'text-primary' : ''} mb-1`}>
                  {subHeader}
                </p>
              )}
              <h4 className={`${isInline ? typography.displayMd : typography.h4} capitalize tracking-tight ${isSkipped ? 'text-muted-foreground line-through' : ''}`}>
                {workout.title || workout.type}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 opacity-70">
                  {workout.importance}
                </Badge>
                <span className={`${typography.mutedXs} opacity-60`}>
                  {workout.estimatedDuration} min
                </span>
              </div>
            </div>
          </div>
          {!isInline && (
            <Badge variant={isSkipped ? "inactive" : "outline"} className={`capitalize ${isSkipped ? '' : typeConfig.colorClass}`}>
              {isSkipped ? 'Skipped' : workout.type}
            </Badge>
          )}
        </div>
        
        {(workout.description || !isInline) && (
          <div className="space-y-3">
            {workout.description && (
              <p className={`${typography.mutedXs} line-clamp-2 opacity-80 leading-relaxed`}>
                {workout.description}
              </p>
            )}
            {!isInline && (
              <div className="flex flex-wrap gap-3">
                 <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-primary" />
                    <p className={typography.mutedXs}>{workout.activities?.length || 0} Stages</p>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-orange-500" />
                    <p className={typography.mutedXs}>Intensity Focus</p>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {onStart && (
        <Button 
          onClick={onStart} 
          variant={isInline || (!isCompleted && !isSkipped) ? 'default' : 'outline'}
          size="sm" 
          className={`w-full rounded-xl gap-2 mt-4 transition-all py-5 ${isInline ? 'font-bold' : typography.smallInherit} ${isCompleted || isSkipped ? 'bg-background/50 border-border/50 backdrop-blur-sm' : ''}`}
        >
          {isCompleted ? 'Review Result' : isSkipped ? 'Details' : 'Start Workout'}
          {isCompleted ? <CheckCircle2 size={14} /> : isSkipped ? <ChevronRight size={14} /> : <Play size={14} className="fill-current" />}
        </Button>
      )}
    </div>
  );
}
