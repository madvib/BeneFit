'use client';

import { Badge, typography } from '@/lib/components';
import { 
  Dumbbell, 
  Zap, 
} from 'lucide-react';
import type { ActivityPerformance } from '@bene/react-api-client';
import { ActivityCard } from './activity-card';

export function CompletedActivityList({ activities, isCollapsible = true }: Readonly<{ activities: ActivityPerformance[], isCollapsible?: boolean }>) {
  return (
    <div className="space-y-6">
      {activities.map((activity, idx) => (
        <ActivityCard 
            key={idx} 
            name={activity.activityType} 
            type={activity.activityType}
            status={activity.completed ? 'completed' : 'skipped'}
            notes={activity.notes}
            duration={activity.durationMinutes}
            isCollapsible={isCollapsible}
            defaultExpanded={idx === 0}
        >
            <div className="space-y-3">
                {activity.exercises?.map((ex, exIdx) => (
                    <div key={exIdx} className="bg-background/50 hover:bg-accent/30 border-border/40 rounded-xl border p-4 transition-all hover:translate-x-1">
                        <div className="mb-3 flex items-start justify-between">
                            <p className={`${typography.large} text-foreground/90 font-bold tracking-tight`}>{ex.name}</p>
                            <Zap size={16} className="text-muted-foreground/40" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <Dumbbell size={16} className="text-muted-foreground/70" />
                                <div className="flex flex-col">
                                     <span className={`${typography.small} font-bold opacity-90`}>
                                        {ex.setsCompleted} Sets
                                    </span>
                                    <span className={`${typography.mutedXs} opacity-60 font-medium`}>Target: {ex.setsPlanned}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {ex.reps?.map((r, i) => (
                                    <Badge key={i} variant="outline" className="text-[10px] h-6 px-2 font-mono bg-accent/5">
                                        {r} <span className="mx-1 opacity-50">×</span> {ex.weight?.[i]}kg
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ActivityCard>
      ))}
    </div>
  );
}
