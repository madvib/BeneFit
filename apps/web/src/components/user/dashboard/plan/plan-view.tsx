'use client';

import { Card, StatCard } from '@/components';
import { PlanData, WeeklyWorkoutPlan } from '@/controllers/plan';

interface PlanViewProps {
  currentPlan: PlanData | null;
  weeklyWorkouts: WeeklyWorkoutPlan[];
  onEditPlan: (id: string) => void;
}

export default function PlanView({ currentPlan, weeklyWorkouts, onEditPlan }: PlanViewProps) {
  if (!currentPlan) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">No current plan available</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card
        title={currentPlan.name}
        actions={
          <button className="btn btn-ghost" onClick={() => onEditPlan(currentPlan.id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        }
      >
        <div>
          <p className="text-muted-foreground mb-4">
            {currentPlan.description}
          </p>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
              {currentPlan.difficulty}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentPlan.duration}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentPlan.category}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress: {currentPlan.progress}%</span>
              <span>Week 3 of 4</span>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${currentPlan.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Workouts" value="18" description="Total planned" />
            <StatCard
              title="Completed"
              value="12"
              description="Finished workouts"
            />
            <StatCard
              title="Remaining"
              value="6"
              description="Upcoming sessions"
            />
          </div>
        </div>
      </Card>

      <Card title="Weekly Schedule">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyWorkouts.map((workout) => (
            <div
              key={workout.id}
              className={`p-4 rounded-lg border ${
                workout.completed
                  ? 'bg-green-50 border-green-500 dark:bg-green-900/20'
                  : 'bg-background border-muted'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{workout.day}</h4>
                  <p className="text-sm text-muted-foreground">
                    {workout.date}
                  </p>
                </div>
                {workout.completed && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Done
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h5 className="font-medium">{workout.exercise}</h5>
                {workout.sets > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {workout.sets} sets × {workout.reps} reps
                  </p>
                )}
                {workout.duration && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {workout.duration}
                  </p>
                )}
              </div>

              <button
                className={`mt-4 w-full btn ${
                  workout.completed ? 'btn-ghost text-green-600' : 'btn-primary'
                }`}
              >
                {workout.completed ? 'Completed' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}