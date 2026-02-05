import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toUserPreferencesView } from '@bene/training-core';
import type { UpdatePreferencesResponse } from '../update-preferences.js';

export type UpdatePreferencesFixtureOptions = BaseFixtureOptions<UpdatePreferencesResponse>;

/**
 * Build UpdatePreferencesResponse fixture using domain fixture + view mapper
 */
export function buildUpdatePreferencesResponse(
  options: UpdatePreferencesFixtureOptions = {}
): Result<UpdatePreferencesResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to update preferences');
  if (errorResult) return errorResult;

  const profile = createUserProfileFixture();
  const preferencesView = toUserPreferencesView(profile.preferences);

  return Result.ok({
    userId: profile.userId,
    preferences: preferencesView,
    ...overrides,
  });
}
