import { Card } from '@/components';
import ProgressBar from '@/components/common/ui-primitives/progress-bar';

interface GoalData {
  id: string;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string; // ISO string
}

interface GoalCardProps {
  goal: GoalData | null;
  onSetNewGoal: () => void;
}

export default function GoalCard({ goal, onSetNewGoal }: GoalCardProps) {
  if (!goal) {
    return (
      <Card title="Current Goal">
        <p className="text-muted-foreground italic">No current goal set</p>
        <button className="mt-4 w-full btn btn-primary" onClick={onSetNewGoal}>
          Set New Goal
        </button>
      </Card>
    );
  }

  return (
    <Card title="Current Goal">
      <div>
        <h4 className="font-semibold text-lg break-words">{goal.title}</h4>
        <p className="text-muted-foreground text-sm mb-4 break-words">
          {goal.description}
        </p>
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm mb-1">
            <div className="flex gap-2">
              <span className="font-medium">
                {goal.currentValue} {goal.unit}
              </span>
              <span className="text-muted-foreground">
                / {goal.targetValue} {goal.unit}
              </span>
            </div>
          </div>
          <ProgressBar
            value={goal.currentValue}
            max={goal.targetValue}
            className="mt-1"
          />
        </div>
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground break-words">
            Deadline: {new Date(goal.deadline).toLocaleDateString()}
          </p>
          <p className="text-muted-foreground break-words">
            Remaining: {(goal.targetValue - goal.currentValue).toFixed(1)} {goal.unit}
          </p>
        </div>
      </div>
      <button className="mt-4 w-full btn btn-primary" onClick={onSetNewGoal}>
        Set New Goal
      </button>
    </Card>
  );
}