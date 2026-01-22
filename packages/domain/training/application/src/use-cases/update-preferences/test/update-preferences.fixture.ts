import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toUserPreferencesView } from '@bene/training-core';
import type { UpdatePreferencesResponse } from '../update-preferences.js';

/**
 * Build UpdatePreferencesResponse fixture using domain fixture + view mapper
 */
export function buildUpdatePreferencesResponse(
  overrides?: Partial<UpdatePreferencesResponse>
): UpdatePreferencesResponse {
  const profile = createUserProfileFixture();
  const preferencesView = toUserPreferencesView(profile.preferences);

  return {
    userId: profile.userId,
    preferences: preferencesView,
    ...overrides,
  };
}
