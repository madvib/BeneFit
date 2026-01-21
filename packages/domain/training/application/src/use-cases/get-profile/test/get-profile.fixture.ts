import {
  createUserProfileFixture,

} from '@bene/training-core/fixtures';
import { toUserProfileView } from '@bene/training-core';
import type { GetProfileResponse } from '../get-profile.js';

/**
 * Build GetProfileResponse fixture using domain fixture + view mapper
 * 
 * Pattern: Domain fixture → View mapper → Use case response
 */
export function buildGetProfileResponse(
  overrides?: Partial<GetProfileResponse>
): GetProfileResponse {
  // 1. Create domain fixture
  const profile = createUserProfileFixture();

  // 2. Map to view (gives us computed fields for free)
  const view = toUserProfileView(profile);

  // 3. Apply any overrides and return
  return {
    ...view,
    ...overrides,
  };
}
