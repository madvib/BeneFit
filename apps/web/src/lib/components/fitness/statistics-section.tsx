'use client';

import { Card, CountUp, Typography, SpotlightCard } from '@/lib/components';
import { profile } from '@bene/react-api-client';
import { Award, Flame, TrendingUp, Clock, Dumbbell, Zap } from 'lucide-react';
import { safeFormatDate } from '@/lib/utils';

export default function StatisticsSection({ stats }: { stats: profile.GetUserStatsResponse }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h3">Fitness Performance</Typography>
        <div className="bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
          <Zap size={12} className="fill-current" />
          <span>Live Stats</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Workouts - Large Bento piece */}
        <SpotlightCard className="border-primary/20 bg-primary/5 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                <Dumbbell size={24} />
              </div>
              <TrendingUp size={20} className="text-primary/50" />
            </div>
            <div className="mt-8">
              <Typography variant="muted" className="mb-1 tracking-widest uppercase">
                Total Workouts
              </Typography>
              <Typography variant="h1" className="text-4xl font-black sm:text-5xl">
                <CountUp to={stats.totalWorkouts || 0} />
              </Typography>
            </div>
          </div>
        </SpotlightCard>

        {/* Total Minutes */}
        <Card className="border-muted/50 col-span-1">
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Clock size={20} />
            </div>
            <div className="mt-4">
              <Typography variant="muted" className="mb-0.5 text-xs tracking-widest uppercase">
                Time Active
              </Typography>
              <div className="flex items-baseline gap-1">
                <Typography variant="h3" className="font-black">
                  <CountUp to={stats.totalMinutes || 0} />
                </Typography>
                <Typography variant="small" className="text-muted-foreground font-bold">
                  min
                </Typography>
              </div>
            </div>
          </div>
        </Card>

        {/* Total Volume */}
        <Card className="border-muted/50 col-span-1">
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp size={20} />
            </div>
            <div className="mt-4">
              <Typography variant="muted" className="mb-0.5 text-xs tracking-widest uppercase">
                Total Volume
              </Typography>
              <div className="flex items-baseline gap-1">
                <Typography variant="h3" className="font-black">
                  <CountUp to={stats.totalVolume || 0} separator="," />
                </Typography>
                <Typography variant="small" className="text-muted-foreground font-bold">
                  lbs
                </Typography>
              </div>
            </div>
          </div>
        </Card>

        {/* Streak Information */}
        <Card className="col-span-1 border-orange-500/20 bg-orange-500/5 sm:col-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-500">
                <Flame size={24} fill={stats.streakActive ? 'currentColor' : 'none'} />
              </div>
              {stats.streakActive && (
                <Typography
                  variant="small"
                  className="rounded-full bg-orange-500/20 px-3 py-1 font-bold tracking-tighter text-orange-600 uppercase"
                >
                  On Fire
                </Typography>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <Typography
                  variant="muted"
                  className="mb-0.5 text-[10px] tracking-widest uppercase"
                >
                  Current Streak
                </Typography>
                <Typography variant="h3" className="font-black text-orange-600">
                  {stats.currentStreak} days
                </Typography>
              </div>
              <div>
                <Typography
                  variant="muted"
                  className="mb-0.5 text-[10px] tracking-widest uppercase"
                >
                  Personal Best
                </Typography>
                <Typography variant="h3" className="font-bold">
                  {stats.longestStreak} d
                </Typography>
              </div>
            </div>
          </div>
        </Card>

        {/* Last Session / Achievements Bento */}
        <Card className="border-muted/50 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                <Award size={24} />
              </div>
              <Typography variant="small" className="text-muted-foreground font-medium">
                Last: {safeFormatDate(stats.lastWorkoutDate)}
              </Typography>
            </div>

            <div className="mt-6">
              <Typography variant="muted" className="mb-3 text-[10px] tracking-widest uppercase">
                Recent Achievements ({stats.achievements.length})
              </Typography>
              <div className="flex flex-wrap gap-2">
                {stats.achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-accent/50 border-muted hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors"
                  >
                    <div className="rounded-lg bg-yellow-500/20 p-1 text-yellow-600">
                      <Zap size={14} fill="currentColor" />
                    </div>
                    <Typography variant="small" className="font-bold whitespace-nowrap">
                      {achievement.name}
                    </Typography>
                  </div>
                ))}
                {stats.achievements.length > 3 && (
                  <div className="bg-muted flex items-center justify-center rounded-xl border border-dashed px-3 py-2">
                    <Typography variant="small" className="text-muted-foreground font-medium">
                      +{stats.achievements.length - 3} more
                    </Typography>
                  </div>
                )}
                {stats.achievements.length === 0 && (
                  <Typography variant="muted" className="italic">
                    Keep training to earn awards!
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
