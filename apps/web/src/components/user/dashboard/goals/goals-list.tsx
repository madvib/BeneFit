import { Card, Button } from '@/components';
import GoalCard from '@/components/user/dashboard/goals/goal-card';

interface GoalsListProps {
  goals: Array<{
    id: string;
    title: string;
    description: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    deadline: string; // ISO string
    status?: string;
  }>;
  onEditGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onShareGoal: (id: string) => void;
  onCreateGoal: () => void;
}

export default function GoalsList({
  goals,
  onEditGoal,
  onDeleteGoal,
  onShareGoal,
  onCreateGoal,
}: GoalsListProps) {
  const headerAction = () => {
    return (
      <Button className="w-full sm:w-auto" onClick={onCreateGoal}>
        Create Goal
      </Button>
    );
  };
  return (
    <Card title={'Your Goals'} headerAction={headerAction()}>
      <div className="space-y-4 sm:space-y-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            description={goal.description}
            currentValue={goal.currentValue}
            targetValue={goal.targetValue}
            unit={goal.unit}
            deadline={goal.deadline}
            status={goal.status}
            onEdit={() => onEditGoal(goal.id)}
            onShare={() => onShareGoal(goal.id)}
            onDelete={() => onDeleteGoal(goal.id)}
          />
        ))}
      </div>
    </Card>
  );
}
