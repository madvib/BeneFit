'use client';

import { Card } from '@/components';
import { ProfileGoal } from '@/controllers/account';

interface GoalsSectionProps {
  goals: ProfileGoal[];
}

export default function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <Card>
      <div className="bg-background p-4 sm:p-5 rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">
          Fitness Goals
        </h3>
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 mr-2 ${
                  goal.completed ? 'text-green-500' : 'text-gray-400'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d={
                    goal.completed
                      ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  }
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">{goal.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}