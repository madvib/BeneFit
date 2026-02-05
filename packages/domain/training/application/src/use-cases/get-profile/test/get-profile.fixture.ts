import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toUserProfileView } from '@bene/training-core';
import type { GetProfileResponse } from '../get-profile.js';

export type GetProfileFixtureOptions = BaseFixtureOptions<GetProfileResponse>;

/**
 * Build GetProfileResponse fixture using domain fixture + view mapper
 */
export function buildGetProfileResponse(
  options: GetProfileFixtureOptions = {}
): Result<GetProfileResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to fetch profile');
  if (errorResult) return errorResult;

  // 1. Create domain fixture
  const profile = createUserProfileFixture();

  // 2. Map to view (gives us computed fields for free)
  const view = toUserProfileView(profile);

  // 3. Apply any overrides and return
  return Result.ok({
    ...view,
    ...overrides,
  });
}
