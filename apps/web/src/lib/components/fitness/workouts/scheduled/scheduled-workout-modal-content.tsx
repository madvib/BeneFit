'use client';

import { Badge, Button, typography } from '@/lib/components';
import { Play, Star, Clock, LucideIcon, Calendar, Dumbbell } from 'lucide-react';
import type { DailyWorkout } from '@bene/react-api-client';
import { ScheduledActivityList } from '../shared/activity-list';
import { StatsGrid } from '../shared/workout-stats-grid';

interface ScheduledWorkoutModalProps {
  workout: DailyWorkout;
  onStart?: () => void;
  Icon: LucideIcon;
  typeConfig: { colorClass: string };
  isTemplate?: boolean;
}

export function ScheduledWorkoutModalContent({
  workout,
  onStart,
  Icon,
  typeConfig,
  isTemplate
}: ScheduledWorkoutModalProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden p-0 pb-8">
        <div className={`absolute top-0 right-0 -m-10 h-64 w-64 rounded-full blur-[80px] ${typeConfig.colorClass.split(' ')[0]}`} />
        
        <div className="container mx-auto relative z-10 px-0">
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

          <div className="flex flex-col gap-8">
            <div className="max-w-3xl">
              <h2 className={`${typography.h2} mb-4 capitalize tracking-tight`}>
                {workout.title || 'Training Session'}
              </h2>
              <p className={`${typography.lead} text-muted-foreground/80 max-w-xl`}>
                {workout.description || 'Commit to the process. Your high-performance plan is ready for execution.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto">
        <div className="grid gap-12 grid-cols-1">
          {/* Activity Column */}
          <div className="space-y-8">
             <StatsGrid items={[
                { label: 'Duration', value: workout.estimatedDuration, unit: 'min', icon: Clock },
                { label: 'Importance', value: workout.importance, icon: Star, highlight: true }
             ]} />

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

          {/* Modal Footer */}
          {onStart && (
             <div className="pb-8">
                <Button onClick={onStart} className={`w-full h-14 rounded-2xl gap-3 shadow-lg ${typography.large} font-bold`}>
                  <Play className="fill-current" size={24} /> Start Session
                </Button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
