'use client';

import { Card, CountUp, SpotlightCard, typography, IconBox } from '@/lib/components';
import { profile } from '@bene/react-api-client';
import { Award, Flame, TrendingUp, Clock, Dumbbell, Zap } from 'lucide-react';
import { safeFormatDate } from '@/lib/utils';

export default function StatisticsSection({ stats }: { stats: profile.GetUserStatsResponse }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={typography.h3}>Fitness Performance</h3>
        <div
          className={`${typography.labelSm} bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1`}
        >
          <Zap size={12} className="fill-current" />
          <span>Live Stats</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Workouts - Large Bento piece */}
        <SpotlightCard className="border-primary/20 bg-primary/5 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <IconBox icon={Dumbbell} variant="default" size="lg" className="rounded-2xl" />
              <TrendingUp size={20} className="text-primary/50" />
            </div>
            <div className="mt-8">
              <p className={`${typography.labelSm} mb-1`}>Total Workouts</p>
              <h1 className={typography.displayLgResponsive}>
                <CountUp to={stats.totalWorkouts || 0} />
              </h1>
            </div>
          </div>
        </SpotlightCard>

        {/* Total Minutes */}
        <Card className="border-muted/50 col-span-1">
          <div className="flex h-full flex-col justify-between p-5">
            <IconBox
              icon={Clock}
              variant="ghost"
              size="md"
              className="rounded-xl bg-orange-500/10 text-orange-500"
            />
            <div className="mt-4">
              <p className={`${typography.labelSm} mb-0.5`}>Time Active</p>
              <div className="flex items-baseline gap-1">
                <h3 className={typography.h3}>
                  <CountUp to={stats.totalMinutes || 0} />
                </h3>
                <p className={`${typography.small} text-muted-foreground italic`}>min</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Total Volume */}
        <Card className="border-muted/50 col-span-1">
          <div className="flex h-full flex-col justify-between p-5">
            <IconBox
              icon={TrendingUp}
              variant="ghost"
              size="md"
              className="rounded-xl bg-blue-500/10 text-blue-500"
            />
            <div className="mt-4">
              <p className={`${typography.labelSm} mb-0.5`}>Total Volume</p>
              <div className="flex items-baseline gap-1">
                <h3 className={typography.h3}>
                  <CountUp to={stats.totalVolume || 0} separator="," />
                </h3>
                <p className={`${typography.small} text-muted-foreground italic`}>lbs</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Streak Information */}
        <Card className="col-span-1 border-orange-500/20 bg-orange-500/5 sm:col-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <IconBox
                icon={Flame}
                variant="ghost"
                size="lg"
                className="rounded-2xl bg-orange-500/20 text-orange-500"
                iconClassName={stats.streakActive ? 'fill-current' : ''}
              />
              {stats.streakActive && (
                <p
                  className={`${typography.labelSm} rounded-full bg-orange-500/20 px-3 py-1 text-orange-600`}
                >
                  On Fire
                </p>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className={`${typography.labelXs} mb-0.5 opacity-60`}>Current Streak</p>
                <h3 className={`${typography.h3} text-orange-600`}>{stats.currentStreak} days</h3>
              </div>
              <div>
                <p className={`${typography.labelXs} mb-0.5 opacity-60`}>Personal Best</p>
                <h3 className={typography.h3}>{stats.longestStreak} d</h3>
              </div>
            </div>
          </div>
        </Card>

        {/* Last Session / Achievements Bento */}
        <Card className="border-muted/50 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <IconBox
                icon={Award}
                variant="ghost"
                size="lg"
                className="rounded-2xl bg-purple-500/10 text-purple-500"
              />
              <p className={`${typography.small} text-muted-foreground`}>
                Last: {safeFormatDate(stats.lastWorkoutDate)}
              </p>
            </div>

            <div className="mt-6">
              <p className={`${typography.labelXs} mb-3 opacity-60`}>
                Recent Achievements ({stats.achievements.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-accent/50 border-muted hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors"
                  >
                    <div className="rounded-lg bg-yellow-500/20 p-1 text-yellow-600">
                      <Zap size={14} fill="currentColor" />
                    </div>
                    <p className={`${typography.small} font-bold`}>{achievement.name}</p>
                  </div>
                ))}
                {stats.achievements.length > 3 && (
                  <div className="bg-muted flex items-center justify-center rounded-xl border border-dashed px-3 py-2">
                    <p className={typography.small}>+{stats.achievements.length - 3} more</p>
                  </div>
                )}
                {stats.achievements.length === 0 && (
                  <p className={`${typography.muted} italic`}>Keep training to earn awards!</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
