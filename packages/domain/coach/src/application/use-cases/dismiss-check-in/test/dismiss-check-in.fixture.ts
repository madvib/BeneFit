import { faker } from '@faker-js/faker';
import type { DismissCheckInResponse } from '../dismiss-check-in.js';

/**
 * Build DismissCheckInResponse fixture
 */
export function buildDismissCheckInResponse(
  overrides?: Partial<DismissCheckInResponse>
): DismissCheckInResponse {
  return {
    conversationId: faker.string.uuid(),
    dismissed: true,
    ...overrides,
  };
}
