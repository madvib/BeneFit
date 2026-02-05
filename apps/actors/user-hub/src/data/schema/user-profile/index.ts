import { profile, profileRelations } from './profile';
import { userStats, userStatsRelations } from './user_stats';
import { achievements, achievementsRelations } from './achievements';

export * from './profile';
export * from './user_stats';
export * from './achievements';

export const user_profile_schema = {
  profile,
  profileRelations,
  userStats,
  userStatsRelations,
  achievements,
  achievementsRelations,
};
