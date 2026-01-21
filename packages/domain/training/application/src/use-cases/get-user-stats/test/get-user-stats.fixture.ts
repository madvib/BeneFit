import {
  createUserProfileFixture

} from '@bene/training-core/fixtures';
import { toUserStatsView } from '@bene/training-core';
import type { GetUserStatsResponse } from '../get-user-stats.js';

export function buildGetUserStatsResponse(
  overrides?: Partial<GetUserStatsResponse>
): GetUserStatsResponse {
  const profile = createUserProfileFixture();

  return {
    ...toUserStatsView(profile.stats),
    ...overrides,
  };
}
