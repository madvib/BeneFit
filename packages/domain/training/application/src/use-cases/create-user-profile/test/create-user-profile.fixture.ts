import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toUserProfileView } from '@bene/training-core';
import type { CreateUserProfileResponse } from '../create-user-profile.js';

/**
 * Build CreateUserProfileResponse fixture using domain fixture + view mapper
 */
export function buildCreateUserProfileResponse(
  options: BaseFixtureOptions<CreateUserProfileResponse> = {}
): Result<CreateUserProfileResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Profile creation failed');
  if (errorResult) return errorResult;

  const profile = createUserProfileFixture();
  const view = toUserProfileView(profile);

  return Result.ok({
    ...view,
    ...overrides,
  });
}
