import { profile, profileRelations } from './profile';
import { userStats, userStatsRelations } from './user_stats';
import { achievements, achievementsRelations } from './achievements';

export * from './profile';
export * from './user_stats';
export * from './achievements';

export const userProfileSchema = {
  profile,
  profileRelations,
  userStats,
  userStatsRelations,
  achievements,
  achievementsRelations,
};
