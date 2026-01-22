import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createUserProfileFixture
} from '@bene/training-core/fixtures';
import { toUserStatsView } from '@bene/training-core';
import type { GetUserStatsResponse } from '../get-user-stats.js';


export function buildGetUserStatsResponse(
  options: BaseFixtureOptions<GetUserStatsResponse> = {}
): Result<GetUserStatsResponse> {
  const { overrides, success } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to fetch user stats');
  if (errorResult) return errorResult;

  const profile = createUserProfileFixture();
  const statsView = toUserStatsView(profile.stats);

  if (success === false) {
    // Return empty stats instead of failing, as this is a common query case
    return Result.ok({
      totalWorkouts: 0,
      totalVolume: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievementsCount: 0,
      ...overrides,
    } as GetUserStatsResponse);
  }

  return Result.ok({
    ...statsView,
    ...overrides,
  });
}
