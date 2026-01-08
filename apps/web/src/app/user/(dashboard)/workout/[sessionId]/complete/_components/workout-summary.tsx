'use client';

import { Card } from '@/lib/components';
import { Clock, Dumbbell, Activity } from 'lucide-react';

interface WorkoutSummaryData {
  durationMinutes?: number;
  type?: string;
  activities?: { type: string; durationMinutes: number }[];
}

interface WorkoutSummaryProps {
  workout?: WorkoutSummaryData;
}

export default function WorkoutSummary({ workout }: WorkoutSummaryProps) {
  if (!workout) return null;

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Summary</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-accent flex items-center gap-3 rounded-lg p-3">
          <Clock className="text-primary" size={24} />
          <div>
            <p className="text-muted-foreground text-sm">Duration</p>
            <p className="font-bold">{workout.durationMinutes} min</p>
          </div>
        </div>
        <div className="bg-accent flex items-center gap-3 rounded-lg p-3">
          <Dumbbell className="text-primary" size={24} />
          <div>
            <p className="text-muted-foreground text-sm">Type</p>
            <p className="font-bold capitalize">{workout.type}</p>
          </div>
        </div>
        <div className="bg-accent flex items-center gap-3 rounded-lg p-3">
          <Activity className="text-primary" size={24} />
          <div>
            <p className="text-muted-foreground text-sm">Intensity</p>
            <p className="font-bold">Moderate</p>
            {/* Placeholder, assuming intensity isn't explicitly in the basic workout object yet */}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Activities Completed</h3>
        <ul className="space-y-2">
          {workout.activities?.map((activity, idx) => (
            <li
              key={idx}
              className="border-border flex items-center justify-between border-b pb-2 text-sm last:border-0"
            >
              <span>{activity.type}</span>
              <span className="text-muted-foreground font-medium">
                {activity.durationMinutes} min
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
