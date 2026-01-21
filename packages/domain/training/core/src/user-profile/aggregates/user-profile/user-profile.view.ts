import { UserProfile } from './user-profile.types.js';
import {
  ExperienceProfileView,
  FitnessGoalsView,
  UserPreferencesView,
  UserStatsView,
  toExperienceProfileView,
  toFitnessGoalsView,
  toUserPreferencesView,
  toUserStatsView,
} from '../../value-objects/index.js';
import {
  toTrainingConstraintsView,
  TrainingConstraintsView,
} from '@/shared/index.js';
import {
  shouldReceiveCheckIn,
  getMemberSinceDays,
} from './user-profile.queries.js';
import { CreateView, serializeForView } from '@bene/shared';

export type UserProfileView = CreateView<
  UserProfile,
  never,
  {
    experienceProfile: ExperienceProfileView;
    fitnessGoals: FitnessGoalsView;
    trainingConstraints: TrainingConstraintsView;
    preferences: UserPreferencesView;
    stats: UserStatsView;
    shouldReceiveCheckIn: boolean;
    memberSinceDays: number;
  }
>;

/**
 * Map UserProfile aggregate to its view model.
 * 
 * Note: Enriched stats (streakActive, daysSinceLastWorkout, achievementsCount, etc.) 
 * are available via the nested stats object (UserStatsView).
 */
export function toUserProfileView(profile: UserProfile): UserProfileView {
  const base = serializeForView(profile);

  return {
    ...base,

    experienceProfile: toExperienceProfileView(profile.experienceProfile),
    fitnessGoals: toFitnessGoalsView(profile.fitnessGoals),
    trainingConstraints: toTrainingConstraintsView(profile.trainingConstraints),
    preferences: toUserPreferencesView(profile.preferences),
    stats: toUserStatsView(profile.stats),

    // Profile-level Computed Fields
    shouldReceiveCheckIn: shouldReceiveCheckIn(profile),
    memberSinceDays: getMemberSinceDays(profile),
  };
}
