import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import {
  createCompletedWorkoutFixture,
  createUserStatsFixture,
  createAchievementFixture
} from '@bene/training-core/fixtures';
import { toCompletedWorkoutView, toUserStatsView, toAchievementView } from '@bene/training-core';
import type { CompleteWorkoutResponse } from '../complete-workout.js';


export function buildCompleteWorkoutResponse(
  options: BaseFixtureOptions<CompleteWorkoutResponse> = {}
): Result<CompleteWorkoutResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Workout completion failed');
  if (errorResult) return errorResult;

  const workout = createCompletedWorkoutFixture();
  const stats = createUserStatsFixture();
  const statsView = toUserStatsView(stats);
  const achievement = createAchievementFixture();

  return Result.ok({
    workout: toCompletedWorkoutView(workout),
    newStreak: faker.number.int({ min: 1, max: 100 }),
    achievementsEarned: [toAchievementView(achievement)],
    stats: {
      totalWorkouts: statsView.totalWorkouts,
      totalVolume: statsView.totalVolume,
      totalMinutes: statsView.totalMinutes,
    },
    ...overrides,
  });
}
