"use client";

import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

interface GoalCardProps {
  id: number;
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
  status = "active",
  onEdit,
  onDelete,
  onShare,
}: GoalCardProps) {
  const progressPercentage = (currentValue / targetValue) * 100;
  const isCompleted = status === "completed";

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-muted">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
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
          barColor={isCompleted ? "bg-green-500" : "bg-primary"}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>

      <div className="mt-4 flex space-x-3">
        {onEdit && (
          <button onClick={onEdit} className="btn btn-ghost btn-sm">
            Edit
          </button>
        )}
        {onShare && (
          <button onClick={onShare} className="btn btn-ghost btn-sm">
            Share
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="btn btn-ghost btn-sm text-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
