import { Clock, Zap, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/lib/components';
import { getActivityColorClass, getActivityIcon } from './constants';
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
      date: new Date(item.recordedAt).toLocaleDateString(),
      duration: `${item.performance.durationMinutes} min`,
      calories: item.performance.caloriesBurned
        ? `${item.performance.caloriesBurned}`
        : undefined,
      status: 'completed',
    };
  }

  // Session (In Progress / Paused / etc)
  return {
    date: item.startedAt ? new Date(item.startedAt).toLocaleDateString() : '—',
    duration: item.liveProgress
      ? `${Math.round(item.liveProgress.elapsedSeconds / 60)} min`
      : '—',
    calories: undefined, // Not available for live sessions yet
    status: item.state,
  };
};

export default function HistoryRow(workout: HistoryItem) {
  const details = getHistoryItemDetails(workout);

  return (
    <tr key={workout.id} className="group hover:bg-muted/20 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-md border ${getActivityColorClass(workout.workoutType)}`}
          >
            {getActivityIcon(workout.workoutType)}
          </div>
          <div>
            <p className="text-foreground font-medium">{workout.workoutType}</p>
          </div>
        </div>
      </td>
      <td className="text-muted-foreground px-6 py-4 font-mono text-xs">{details.date}</td>
      <td className="px-6 py-4">
        <span className="text-foreground flex items-center gap-1 text-xs">
          <Clock size={12} className="text-muted-foreground" /> {details.duration}
        </span>
        {details.calories && (
          <span className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
            <Zap size={12} /> {details.calories} kcal
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <Badge variant={mapStatusToBadgeVariant(details.status)}>
          {details.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-muted-foreground hover:text-primary p-1 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}
