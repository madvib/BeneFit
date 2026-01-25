'use client';

import { Badge, Button, IconBox, typography, Card, MetricCard } from '@/lib/components';
import { Play, Dumbbell, Star, SkipForward, Info, Zap, LucideIcon, Calendar } from 'lucide-react';
import type { DailyWorkout } from '@bene/react-api-client';
import { ScheduledActivityList } from '../shared/activity-list';

interface ScheduledWorkoutDashboardProps {
  workout: DailyWorkout;
  onStart?: () => void;
  onSkip?: () => void;
  isTemplate?: boolean;
  Icon: LucideIcon;
  typeConfig: { colorClass: string };
}

export function ScheduledWorkoutDashboard({
  workout,
  onStart,
  onSkip,
  isTemplate,
  Icon,
  typeConfig
}: ScheduledWorkoutDashboardProps) {
  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute top-1/4 left-1/4 h-128 w-128 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="animation-delay-2000 animate-blob absolute right-1/4 bottom-1/4 h-128 w-128 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-16 px-6">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="outline" className={`capitalize px-3 py-1 ${typeConfig.colorClass}`}>
              <Icon size={14} className="mr-2" />
              {workout.type}
            </Badge>
            {!isTemplate && (
               <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                 <Calendar size={14} /> Today&apos;s Plan
               </Badge>
            )}
            {workout.importance === 'critical' && (
               <Badge variant="error" className="gap-1.5 px-3 py-1">
                 <Star size={14} className="fill-current" /> Priority Session
               </Badge>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className={`${typography.displayLgResponsive} mb-4 capitalize tracking-tight`}>
                {workout.title || 'Training Session'}
              </h1>
              <p className={`${typography.lead} text-muted-foreground/80 max-w-xl`}>
                {workout.description || 'Commit to the process. Your high-performance plan is ready for execution.'}
              </p>
            </div>

            {/* Top Level Stats */}
            <div className="flex gap-8 items-center bg-background/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
              <MetricCard
                label="Volume"
                value={workout.activities?.length || 0}
                unit="Acts"
                icon={Dumbbell}
                className="bg-transparent border-none shadow-none p-0"
                bodyClassName="p-0 gap-1"
              />
              <div className="bg-border/30 h-10 w-px" />
              <MetricCard
                label="Goals"
                value={workout.goals?.volume?.totalSets || '-'}
                unit="Sets"
                icon={Zap}
                className="bg-transparent border-none shadow-none p-0"
                bodyClassName="p-0 gap-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 -mt-4 pb-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Activity Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
               <h3 className={`${typography.h3} flex items-center gap-3`}>
                  <Dumbbell className="text-primary" size={28} /> Session Flow
               </h3>
               <span className={`${typography.mutedXs} font-bold opacity-60`}>
                 {workout.estimatedDuration} MIN TOTAL
               </span>
            </div>
            <ScheduledActivityList activities={workout.activities || []} isCollapsible={true} />
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-12 space-y-8">
               {/* Primary CTA Card */}
               <Card className="border-primary/20 bg-background/40 p-8 shadow-2xl backdrop-blur-2xl rounded-[32px] overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="mb-8 flex items-center gap-4">
                    <IconBox icon={Star} variant="default" size="lg" iconClassName="fill-current text-primary" className="shadow-lg shadow-primary/20" />
                    <div>
                      <p className={typography.displayMd}>Ready to push?</p>
                      <p className={typography.displaySm}>Performance tracking is active.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {onStart && (
                       <Button 
                         onClick={onStart} 
                         size="lg" 
                         className={`h-16 w-full gap-3 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.98] ${typography.displayMd}`}
                       >
                         <Play size={24} className="fill-current" />
                         Start Session
                       </Button>
                    )}
                    
                    {!isTemplate && onSkip && (
                       <Button 
                         variant="ghost" 
                         onClick={onSkip}
                         className="text-muted-foreground hover:text-foreground w-full h-12 rounded-xl hover:bg-muted/30"
                       >
                         <SkipForward size={18} className="mr-2" />
                         Reschedule Session
                       </Button>
                    )}
                  </div>
               </Card>

               {/* Strategic Notes / Goals */}
               <div className="bg-card/50 border border-border/40 p-8 rounded-[32px] space-y-6 shadow-sm">
                  <div className="flex items-center gap-3 text-primary/70 border-b border-border/40 pb-4">
                     <Info size={20} />
                     <span className={typography.displaySm}>Plan Insight</span>
                  </div>
                  
                  {workout.goals?.volume && (
                    <div className="space-y-2">
                       <p className={`${typography.mutedXs} font-bold opacity-50`}>TARGET VOLUME</p>
                       <p className={typography.small}>
                          Aim for <strong>{workout.goals.volume.totalSets} sets</strong> across all activities. 
                          Intensity focus: <strong>{workout.goals.volume.targetWeight || 'moderate'}</strong>.
                       </p>
                    </div>
                  )}

                  {workout.coachNotes && (
                     <div className="space-y-2">
                        <p className={`${typography.mutedXs} font-bold opacity-50 text-blue-500`}>COACH NOTES</p>
                        <p className={`${typography.small} text-muted-foreground italic leading-relaxed`}>
                           &quot;{workout.coachNotes}&quot;
                        </p>
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
