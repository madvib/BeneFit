import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toUserProfileView } from '@bene/training-core';
import type { CreateUserProfileResponse } from '../create-user-profile.js';

/**
 * Build CreateUserProfileResponse fixture using domain fixture + view mapper
 */
export function buildCreateUserProfileResponse(
  overrides?: Partial<CreateUserProfileResponse>
): CreateUserProfileResponse {
  const profile = createUserProfileFixture();
  const view = toUserProfileView(profile);

  return {
    ...view,
    ...overrides,
  };
}
