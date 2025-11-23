'use client';

import { Card } from '@/components';
import { FitnessStats } from '@/controllers/account';

interface StatisticsSectionProps {
  stats: FitnessStats;
}

export default function StatisticsSection({ stats }: StatisticsSectionProps) {
  return (
    <Card>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">
          Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between border-b pb-2 border-muted">
            <span className="text-muted-foreground">Total Distance:</span>
            <span className="font-semibold">{stats.totalDistance} km</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between border-b pb-2 border-muted">
            <span className="text-muted-foreground">Total Calories:</span>
            <span className="font-semibold">{stats.totalCalories.toLocaleString()} cal</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between border-b pb-2 border-muted">
            <span className="text-muted-foreground">Avg. Heart Rate:</span>
            <span className="font-semibold">{stats.averageHeartRate} bpm</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
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