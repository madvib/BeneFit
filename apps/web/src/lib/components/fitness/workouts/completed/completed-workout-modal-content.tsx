

import { Badge, Card, typography } from '@/lib/components';
import { 
  CheckCircle2, 
  Dumbbell, 
  Clock, 
  Flame, 
  Activity, 
  Trophy, 
  Heart, 
  Info, 
  AlertTriangle,
  Star,
  Percent,
  Layers,
  LucideIcon
} from 'lucide-react';
import type { CompletedWorkout } from '@bene/react-api-client';
import { CompletedActivityList } from '../shared/activity-list';
import { StatsGrid } from '../shared/workout-stats-grid';

interface CompletedWorkoutModalProps {
  workout: CompletedWorkout;
  Icon: LucideIcon;
  typeConfig: { colorClass: string };
}

export function CompletedWorkoutModalContent({
  workout,
  Icon,
  typeConfig
}: CompletedWorkoutModalProps) {
  const { performance } = workout;

  return (
    <div className="flex flex-col h-full">
      {/* Hero / Header */}
      <div className="relative overflow-hidden p-0 pb-10">
         <div className="container mx-auto relative z-10 px-0">
             <div className="flex items-center gap-2 mb-6">
                 <Badge variant="outline" className={`capitalize px-3 py-1 ${typeConfig.colorClass}`}>
                    <Icon size={14} className="mr-2" />
                    {workout.workoutType}
                 </Badge>
                 <Badge variant="success" className="gap-1.5 px-3 py-1 bg-success/10 text-success border-success/20">
                    <CheckCircle2 size={14} /> Workout Complete
                 </Badge>
             </div>
             <h2 className={`${typography.h2} mb-4 capitalize tracking-tight`}>
                {workout.title || 'Completed Session'}
             </h2>
             <p className={`${typography.lead} text-muted-foreground font-medium`}>
                {workout.recordedAt ? new Date(workout.recordedAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : 'No date recorded'}
             </p>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto">
        <div className="grid gap-12 grid-cols-1">
          
          {/* Main Stats Column */}
          <div className="space-y-12">
              {/* Primary Stats */}
              <StatsGrid items={[
                 { label: 'Duration', value: performance.durationMinutes, unit: 'min', icon: Clock },
                 { label: 'Volume', value: performance.totalVolume, unit: 'kg', icon: Dumbbell },
                 { label: 'Sets', value: performance.totalSets, icon: Layers },
                 { label: 'Calories', value: performance.caloriesBurned!, unit: 'kcal', icon: Flame },
                 { label: 'Energy', value: performance.energyLevel, icon: Activity, highlight: true },
                 { label: 'RPE', value: performance.difficultyRating?.replace('_', ' ') ?? '-', unit: '/10', icon: Trophy },
                 { label: 'Completion', value: Math.round(performance.completionRate * 100), unit: '%', icon: Percent },
              ]} />

              {/* Activity Breakdown */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className={`${typography.h3} flex items-center gap-3`}>
                        <Dumbbell className="text-primary" size={28} /> Performance Log
                    </h3>
                    <Badge variant="outline" className="font-mono text-[10px] opacity-60">
                      {Math.round(performance.completionRate * 100)}% COMPLETED
                    </Badge>
                 </div>
                 <CompletedActivityList activities={performance.activities || []} isCollapsible={true} />
              </div>
          </div>

          {/* Analysis Section */}
          <div className="space-y-10">
              {/* Heart Rate Analysis */}
              <section className="space-y-4">
                 <h3 className={`flex items-center gap-3 ${typography.displaySm} text-rose-500/80 tracking-wider`}>
                    <Heart size={20} className="fill-rose-500" /> HR Analysis
                 </h3>
                 <Card className="border-border/40 bg-card/50 p-6 backdrop-blur-sm shadow-sm ring-1 ring-white/5">
                    <div className="mb-6 flex items-end justify-between">
                      <div>
                        <span className={`${typography.mutedXs} font-bold opacity-60`}>AVG BEATS</span>
                        <div className={`${typography.h2} font-black`}>
                          {performance.heartRate?.average ?? '--'}{' '}
                          <span className={`${typography.muted} text-sm font-medium`}>bpm</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`${typography.mutedXs} font-bold opacity-60`}>PEAK BEATS</span>
                        <div className={`${typography.h2} font-black`}>
                          {performance.heartRate?.max ?? '--'}{' '}
                          <span className={`${typography.muted} text-sm font-medium`}>bpm</span>
                        </div>
                      </div>
                    </div>
                 </Card>
              </section>

              {/* Summary */}
              <section className="space-y-4 pb-10">
                 <h3 className={`flex items-center gap-3 ${typography.displaySm} text-blue-500/80 tracking-wider`}>
                    <Info size={20} /> Summary
                 </h3>
                 <Card className="divide-border/40 border-border/40 bg-card/50 divide-y overflow-hidden shadow-sm backdrop-blur-sm">
                    {performance.notes && (
                      <div className="p-5">
                        <span className={`${typography.mutedXs} mb-2 block font-bold opacity-50`}>COACH FEEDBACK</span>
                        <p className={`${typography.small} text-foreground/90 leading-relaxed italic`}>
                          &quot;{performance.notes}&quot;
                        </p>
                      </div>
                    )}
                    
                    {performance.injuries && performance.injuries.length > 0 && (
                      <div className="bg-destructive/5 p-5">
                        <span className={`${typography.mutedXs} mb-2 flex items-center gap-2 text-destructive font-bold`}>
                          <AlertTriangle size={14} /> INJURIES REPORTED
                        </span>
                        <ul className={`${typography.small} text-foreground/90 space-y-1`}>
                          {performance.injuries.map((injury, i) => (
                            <li key={i} className="flex items-center gap-2">
                               <div className="w-1 h-1 rounded-full bg-destructive" />
                               {injury}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Enjoyment Rating */}
                    <div className="flex items-center justify-between p-5 bg-muted/20">
                      <span className={`${typography.mutedXs} font-bold opacity-60`}>ENJOYMENT</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= performance.enjoyment
                                ? 'text-primary fill-primary shadow-sm'
                                : 'text-border opacity-30'
                            }
                          />
                        ))}
                      </div>
                    </div>
                 </Card>
              </section>
          </div>
        </div>
      </div>
    </div>
  );
}
