import { profile, profileRelations } from './profile.js';
import { userStats, userStatsRelations } from './user_stats.js';
import { achievements, achievementsRelations } from './achievements.js';

export * from './profile.js';
export * from './user_stats.js';
export * from './achievements.js';

export const user_profile_schema = {
  profile,
  profileRelations,
  userStats,
  userStatsRelations,
  achievements,
  achievementsRelations,
};
