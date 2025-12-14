import { profile, profileRelations } from './profile.ts';
import { userStats, userStatsRelations } from './user_stats.ts';
import { achievements, achievementsRelations } from './achievements.ts';

export * from './profile.ts';
export * from './user_stats.ts';
export * from './achievements.ts';

export const user_profile_schema = {
  profile,
  profileRelations,
  userStats,
  userStatsRelations,
  achievements,
  achievementsRelations,
};
