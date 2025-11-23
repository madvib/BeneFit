import { Clock, Zap, MoreHorizontal } from 'lucide-react';
import {
  getActivityColorClass,
  getActivityIcon,
} from '@/components/common/activity/activity-styles';
import { Badge } from '@/components';
import { ActivityType } from '@bene/core/activities';
import { WorkoutData } from './workout-list';

const mapStatusToBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in progress':
      return 'info';
    default:
      return 'error';
  }
};
export default function HistoryRow(workout: WorkoutData) {
  return (
    <tr key={workout.id} className="group hover:bg-muted/20 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-md border ${getActivityColorClass(workout.type)}`}
          >
            {getActivityIcon(workout.type as ActivityType)}
          </div>
          <div>
            <p className="text-foreground font-medium">{workout.type}</p>
            {/* <p className="text-muted-foreground text-xs capitalize">
                          {workout.type}
                        </p> */}
          </div>
        </div>
      </td>
      <td className="text-muted-foreground px-6 py-4 font-mono text-xs">
        {workout.date}
      </td>
      <td className="px-6 py-4">
        {workout.duration && (
          <span className="text-foreground flex items-center gap-1 text-xs">
            <Clock size={12} className="text-muted-foreground" /> {workout.duration}
          </span>
        )}
        {workout.calories && (
          <span className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
            <Zap size={12} /> {workout.calories} kcal
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {workout.status && (
          <Badge variant={mapStatusToBadgeVariant(workout.status)}>
            {workout.status}
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-muted-foreground hover:text-primary p-1 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}
