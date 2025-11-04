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
  return (
    <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold">Your Goals</h3>
        <button className="btn btn-primary w-full sm:w-auto" onClick={onCreateGoal}>
          Create Goal
        </button>
      </div>

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
    </div>
  );
}
