'use client';

import { Card } from '@/lib/components';

export default function StatisticsSection({
  ...stats
}: {
  totalDistance: string;
  totalCalories: number;
  averageHeartRate: number;
  lastWorkoutDate: Date;
}) {
  return (
    <Card>
      <div className="p-4 sm:p-5">
        <h3 className="mb-3 text-lg font-semibold sm:text-xl">Statistics</h3>
        <div className="space-y-3">
          <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
            <span className="text-muted-foreground">Total Distance:</span>
            <span className="font-semibold">{stats.totalDistance} km</span>
          </div>
          <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
            <span className="text-muted-foreground">Total Calories:</span>
            <span className="font-semibold">{stats.totalCalories.toLocaleString()} cal</span>
          </div>
          <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
            <span className="text-muted-foreground">Avg. Heart Rate:</span>
            <span className="font-semibold">{stats.averageHeartRate} bpm</span>
          </div>
          <div className="flex flex-col justify-between sm:flex-row">
            <span className="text-muted-foreground">Last Workout:</span>
            <span className="font-semibold">
              {new Date(stats.lastWorkoutDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
