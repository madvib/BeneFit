'use client';

import { Card } from '@/lib/components';
import { profile } from '@bene/react-api-client';
import { Award, Flame, TrendingUp } from 'lucide-react';

export default function StatisticsSection({ stats }: { stats: profile.GetUserStatsResponse }) {
  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <Card>
        <div className="p-4 sm:p-5">
          <h3 className="mb-4 text-lg font-semibold sm:text-xl">Statistics</h3>
          <div className="space-y-3">
            <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
              <span className="text-muted-foreground">Total Workouts:</span>
              <span className="font-semibold">{stats.totalWorkouts}</span>
            </div>
            <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
              <span className="text-muted-foreground">Total Minutes:</span>
              <span className="font-semibold">{stats.totalMinutes} min</span>
            </div>
            <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
              <span className="text-muted-foreground">Total Volume:</span>
              <span className="font-semibold">{stats.totalVolume.toLocaleString()} lbs</span>
            </div>
            <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
              <span className="text-muted-foreground">Last Workout:</span>
              <span className="font-semibold">{stats.lastWorkoutDate}</span>
            </div>
            {stats.daysSinceLastWorkout !== null && (
              <div className="flex flex-col justify-between sm:flex-row">
                <span className="text-muted-foreground">Days Since Last Workout:</span>
                <span className="font-semibold">{stats.daysSinceLastWorkout} days</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Streak Card */}
      <Card>
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Flame
              className={stats.streakActive ? 'text-orange-500' : 'text-muted-foreground'}
              size={20}
            />
            <h3 className="text-lg font-semibold sm:text-xl">Streak</h3>
          </div>
          <div className="space-y-3">
            <div className="border-muted flex flex-col justify-between border-b pb-2 sm:flex-row">
              <span className="text-muted-foreground">Current Streak:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{stats.currentStreak} days</span>
                {stats.streakActive && (
                  <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-500">
                    Active
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between sm:flex-row">
              <span className="text-muted-foreground">Longest Streak:</span>
              <span className="font-semibold">{stats.longestStreak} days</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements Card */}
      {stats.achievements.length > 0 && (
        <Card>
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              <h3 className="text-lg font-semibold sm:text-xl">
                Achievements ({stats.achievements.length})
              </h3>
            </div>
            <div className="space-y-3">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border-muted flex flex-col justify-between border-b pb-3 last:border-0 sm:flex-row"
                >
                  <div className="flex items-start gap-3">
                    <TrendingUp className="text-primary mt-1" size={18} />
                    <div>
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="text-muted-foreground text-sm">
                        Earned {achievement.earnedAt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
