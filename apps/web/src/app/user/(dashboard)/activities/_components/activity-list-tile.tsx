import { Clock, Zap, MoreHorizontal } from 'lucide-react';
import {
  Badge,
  Button,
  getActivityColorClass,
  getActivityIcon,
  typography,
} from '@/lib/components';
import type { HistoryItem } from './workout-list';

const mapStatusToBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'info';
    case 'skipped':
    case 'abandoned':
      return 'error';
    default:
      return 'secondary';
  }
};

const getHistoryItemDetails = (item: HistoryItem) => {
  const isCompleted = 'recordedAt' in item;

  if (isCompleted) {
    return {
      date: new Date(item.recordedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      duration: `${item.performance.durationMinutes}m`,
      calories: item.performance.caloriesBurned
        ? `${item.performance.caloriesBurned}`
        : undefined,
      status: 'completed',
    };
  }

  // Session (In Progress / Paused / etc)
  return {
    date: item.startedAt
      ? new Date(item.startedAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      : '—',
    duration: item.liveProgress ? `${Math.round(item.liveProgress.elapsedSeconds / 60)}m` : '—',
    calories: undefined, // Not available for live sessions yet
    status: item.state,
  };
};

interface ACtivityListTileProps {
  workout: HistoryItem;
  onClick?: () => void;
}

export default function ActivityListTile({ workout, onClick }: ACtivityListTileProps) {
  const details = getHistoryItemDetails(workout);

  return (
    <tr
      key={workout.id}
      onClick={onClick}
      className="group hover:bg-accent/50 border-border/50 cursor-pointer border-b transition-colors last:border-0"
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 shadow-sm ${getActivityColorClass(workout.workoutType)}`}
          >
            {getActivityIcon(workout.workoutType)}
          </div>
          <div>
            <p className={`${typography.small} font-bold capitalize`}>{workout.workoutType}</p>
            <p className={`${typography.mutedXs} opacity-60`}>Session</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className={`${typography.small} text-muted-foreground opacity-80`}>{details.date}</p>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" />
            <p className={`${typography.small} font-bold`}>{details.duration}</p>
          </div>
          {details.calories && (
            <div className="flex items-center gap-1.5 opacity-70">
              <Zap size={14} className="text-orange-500" />
              <p className={`${typography.mutedXs} font-bold opacity-70`}>
                {details.calories} kcal
              </p>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-5">
        <Badge
          variant={mapStatusToBadgeVariant(details.status)}
          className={`${typography.labelXs}`}
        >
          {details.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="px-6 py-5 text-right">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/10 hover:text-primary h-auto rounded-lg p-2"
        >
          <MoreHorizontal size={18} />
        </Button>
      </td>
    </tr>
  );
}
