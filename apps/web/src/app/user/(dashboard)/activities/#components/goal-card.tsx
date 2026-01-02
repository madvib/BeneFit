import { ArrowRight, Target } from 'lucide-react';
import { ProgressBar } from '@/lib/components';

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
  if (!goal) return null;
  const percentage = Math.round((goal.currentValue / goal.targetValue) * 100);

  return (
    <div className="bg-background border-muted flex flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="border-muted bg-accent/20 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Current Goal</h3>
        </div>
        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase">
          Active
        </span>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-foreground text-xl font-bold">{goal.title}</h4>
          <p className="text-muted-foreground mt-1 text-sm">{goal.description}</p>
        </div>
        <div className="bg-muted/30 border-muted mb-6 rounded-xl border p-4">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-foreground text-2xl font-bold">{percentage}%</span>
            <span className="text-muted-foreground text-xs font-medium">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <ProgressBar value={goal.currentValue} max={goal.targetValue} />
        </div>
        <div className="border-muted/60 border-t pt-4">
          <button
            onClick={onSetNewGoal}
            className="group text-muted-foreground hover:text-primary flex w-full items-center justify-between text-sm font-medium"
          >
            <span>Update Goal</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
