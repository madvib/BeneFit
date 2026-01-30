

import { typography } from '@/lib/components';
import { 
  Dumbbell, 
  Zap, 
  Info,
} from 'lucide-react';
import type { WorkoutActivity } from '@bene/react-api-client';
import { ActivityCard } from './activity-card';

export function ScheduledActivityList({ activities, isCollapsible = true }: Readonly<{ activities: WorkoutActivity[], isCollapsible?: boolean }>) {
  return (
    <div className="space-y-6">
      {activities.map((activity, idx) => (
        <ActivityCard 
            key={idx} 
            name={activity.name} 
            type={activity.type}
            duration={activity.duration}
            instructions={activity.instructions}
            isCollapsible={isCollapsible}
            defaultExpanded={idx === 0}
        >
            <div className="space-y-3">
                {activity.structure?.exercises?.map((ex, exIdx) => (
                     <div key={exIdx} className="bg-background/50 hover:bg-accent/30 border-border/40 rounded-xl border p-4 transition-all hover:translate-x-1">
                        <div className="mb-3 flex items-start justify-between">
                            <p className={`${typography.large} text-foreground/90 font-bold tracking-tight`}>{ex.name}</p>
                            <Zap size={16} className="text-muted-foreground/40" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <Dumbbell size={16} className="text-muted-foreground/70" />
                                <span className={`${typography.small} font-bold opacity-90`}>
                                    {ex.sets} Sets
                                </span>
                            </div>
                            {ex.reps && (
                                <span className={`${typography.small} font-bold opacity-90 backdrop-blur-sm bg-accent/5 px-2 py-0.5 rounded-md`}>
                                    {ex.reps} Reps
                                </span>
                            )}
                            {ex.weight && (
                                <span className={`${typography.small} font-bold opacity-90 backdrop-blur-sm bg-primary/5 px-2 py-0.5 rounded-md`}>
                                   {ex.weight}kg
                                </span>
                            )}
                        </div>
                        {ex.notes && (
                            <div className="bg-muted/20 border-border/10 mt-3 flex items-start gap-3 rounded-lg border p-3">
                                <Info size={14} className="mt-0.5 shrink-0 text-primary opacity-70" />
                                <p className={`${typography.mutedXs} italic opacity-80 leading-relaxed`}>{ex.notes}</p>
                            </div>
                        )}
                     </div>
                ))}
            </div>
        </ActivityCard>
      ))}
    </div>
  );
}
