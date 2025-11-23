'use client';

import ProgressBar from '../../../common/ui-primitives/progress-bar/progress-bar';
import { Badge, Button } from '@/components';

interface GoalCardProperties {
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  status?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export default function GoalCard({
  title,
  description,
  currentValue,
  targetValue,
  unit,
  deadline,
  status = 'active',
  onEdit,
  onDelete,
  onShare,
}: GoalCardProperties) {
  const progressPercentage = (currentValue / targetValue) * 100;
  const isCompleted = status === 'completed';

  // Map status values to badge variants
  const getBadgeVariant = (statusValue: string) => {
    switch (statusValue.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      case 'active':
        return 'active';
      case 'in progress':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-background border-muted rounded-lg border p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {status && (
          <Badge variant={getBadgeVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between text-sm">
          <span>
            {currentValue} {unit}
          </span>
          <span>
            {targetValue} {unit}
          </span>
        </div>
        <ProgressBar
          value={currentValue}
          max={targetValue}
          barColor={isCompleted ? 'bg-green-500' : 'bg-primary'}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>

      <div className="mt-4 flex space-x-3">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onShare && (
          <Button variant="ghost" size="sm" onClick={onShare}>
            Share
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" className="text-red-600" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
