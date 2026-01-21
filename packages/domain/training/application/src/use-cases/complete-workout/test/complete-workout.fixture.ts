import { faker } from '@faker-js/faker';
import {
  createCompletedWorkoutFixture,
  createUserStatsFixture,
  createAchievementFixture
} from '@bene/training-core/fixtures';
import { toCompletedWorkoutView, toUserStatsView, toAchievementView } from '@bene/training-core';
import type { CompleteWorkoutResponse } from '../complete-workout.js';

export function buildCompleteWorkoutResponse(
  overrides?: Partial<CompleteWorkoutResponse>
): CompleteWorkoutResponse {
  const workout = createCompletedWorkoutFixture();
  const stats = createUserStatsFixture();
  const statsView = toUserStatsView(stats);
  const achievement = createAchievementFixture();

  return {
    workout: toCompletedWorkoutView(workout),
    newStreak: faker.number.int({ min: 1, max: 100 }),
    achievementsEarned: [toAchievementView(achievement)],
    stats: {
      totalWorkouts: statsView.totalWorkouts,
      totalVolume: statsView.totalVolume,
      totalMinutes: statsView.totalMinutes,
    },
    ...overrides,
  };
}
