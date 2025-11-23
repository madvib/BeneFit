'use client';

import { Card } from '@/components';
import { ProfileGoal } from '@/controllers/account';
import { CheckCircle, XCircle } from 'lucide-react';
interface GoalsSectionProps {
  goals: ProfileGoal[];
}

export default function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <Card>
      <div className="p-4 sm:p-5">
        <h3 className="mb-3 text-lg font-semibold sm:text-xl">Fitness Goals</h3>
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-center">
              {goal.completed ? (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="mr-2 h-5 w-5 text-gray-400" />
              )}
              <span className="text-base">{goal.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
