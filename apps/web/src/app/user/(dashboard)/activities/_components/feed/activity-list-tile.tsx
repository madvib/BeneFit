import { Clock, Zap, Heart, MapPin, Trash2 } from 'lucide-react';
import {
  Badge,
  typography,
  IconBox,
  DateDisplay,
  Button,
} from '@/lib/components';
import { getActivityTypeConfig, getActivityStatusConfig } from '@/lib/constants/training-ui';
import type { CompletedWorkout } from '@bene/shared';


const getHistoryItemDetails = (item: CompletedWorkout) => {
  return {
    duration: `${item.performance.durationMinutes}m`,
    calories: item.performance.caloriesBurned
      ? `${item.performance.caloriesBurned}`
      : undefined,
    rpe: item.performance.perceivedExertion,
    heartRate: item.performance.heartRate?.average ? Math.round(item.performance.heartRate.average) : undefined,
    // Calculated metrics
    distance: item.performance.activities.flatMap(a => a.exercises || []).reduce((acc, ex) => acc + (ex.distance || 0), 0),
    status: 'completed',
  };
};

interface ActivityListTileProps {
  workout: CompletedWorkout;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function ActivityListTile({ workout, onClick, onDelete }: ActivityListTileProps) {
  const details = getHistoryItemDetails(workout);
  const activityConfig = getActivityTypeConfig(workout.workoutType);
  const statusConfig = getActivityStatusConfig(details.status);
  
  const statsConfig = [
    {
      value: details.calories ? `${details.calories} kcal` : null,
      icon: Zap,
      colorClass: 'text-orange-500',
    },
    {
      value: details.heartRate ? `${details.heartRate} bpm` : null,
      icon: Heart,
      colorClass: 'text-rose-500',
    },
    {
      value: details.distance > 0 ? `${(details.distance / 1000).toFixed(2)} km` : null,
      icon: MapPin,
      colorClass: 'text-emerald-500',
    },
    {
      value: details.rpe ? `RPE ${details.rpe}` : null,
      icon: null, // RPE is special, uses badge style
      colorClass: 'text-foreground',
    },
  ];

  const statsContent = (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${typography.small} sm:gap-4`}>
        {/* Date & Duration always first */}
        <div className="flex items-center gap-1.5 opacity-60">
          <IconBox icon={Clock} variant="ghost" size="xs" className="p-0" />
          <span className={typography.small}><DateDisplay date={workout.recordedAt} format="short" /> • {details.duration}</span>
        </div>

        {/* Dynamic Stats */}
        {statsConfig.map((stat, i) => {
          if (!stat.value) return null;
          return (
             <div key={i} className="flex items-center gap-1.5 opacity-60">
               {stat.icon && (
                  <IconBox icon={stat.icon} variant="ghost" size="xs" className={`p-0 ${stat.colorClass}`} />
               )}
               {/* Special case for RPE styling if needed, or just efficient text */}
               {!stat.icon && stat.value.includes('RPE') ? (
                  <span className={`${typography.labelXs} bg-accent/50 rounded-md px-1.5 py-0.5`}>{stat.value}</span>
               ) : (
                  <span className={typography.small}>{stat.value}</span>
               )}
             </div>
          );
        })}
      </div>
    </div>
  );



  return (
    <div
      onClick={onClick}
      className="hover:bg-accent/50 border-border/50 cursor-pointer border-b px-4 py-3 transition-colors last:border-0 sm:px-6"
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Main Icon */}
        <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 sm:h-12 sm:w-12 shadow-sm ${activityConfig.colorClass}`}>
          <IconBox icon={activityConfig.icon} size="sm" variant="ghost" className={`p-0 ${activityConfig.iconClass}`} />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Header Row: Title + Actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={`${typography.large} truncate font-bold`}>
              {workout.title || activityConfig.label || workout.workoutType}
            </h3>
            
            {/* Actions / Badge */}
            <div className="flex shrink-0 items-center gap-2">
               {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 transition-all group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
               )}
               <Badge variant={statusConfig.variant} className={`${typography.labelXs} h-6 px-2`}>
                 {statusConfig.label}
               </Badge>
            </div>
          </div>

          {/* Stats Row - Full width now */}
          {statsContent}
        </div>
      </div>
    </div>
  );
}
