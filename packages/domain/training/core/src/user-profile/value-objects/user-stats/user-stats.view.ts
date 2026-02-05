import { serializeForView, CreateView } from '@bene/shared';
import { UserStats, Achievement, AchievementView } from './user-stats.types.js';
import * as Queries from './user-stats.queries.js';

export interface UserStatsView extends CreateView<UserStats> {
  streakActive: boolean;
  daysSinceLastWorkout: number | null;
  averageWorkoutDuration: number;
  averageVolumePerWorkout: number;
  achievementsCount: number;
}

export function toAchievementView(achievement: Achievement): AchievementView {
  return serializeForView(achievement);
}

export function toUserStatsView(stats: UserStats): UserStatsView {
  const base = serializeForView(stats);
  return {
    ...base,
    achievements: stats.achievements.map(toAchievementView),
    streakActive: Queries.isStreakActive(stats),
    daysSinceLastWorkout: Queries.getDaysSinceLastWorkout(stats),
    averageWorkoutDuration: Queries.getAverageWorkoutDuration(stats),
    averageVolumePerWorkout: Queries.getAverageVolumePerWorkout(stats),
    achievementsCount: Queries.getAchievementsCount(stats),
  };
}
