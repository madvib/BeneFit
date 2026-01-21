import { faker } from '@faker-js/faker';
import { createCoachActionFixture } from '../../../../fixtures.js';
import {
  toCoachActionView
} from '@core/index.js';
import type { RespondToCheckInResponse } from '../respond-to-check-in.js';

/**
 * Build RespondToCheckInResponse fixture
 */
export function buildRespondToCheckInResponse(
  overrides?: Partial<RespondToCheckInResponse>
): RespondToCheckInResponse {
  const action = createCoachActionFixture();

  return {
    conversationId: faker.string.uuid(),
    coachAnalysis: faker.lorem.paragraph(),
    actions: [toCoachActionView(action)],
    ...overrides,
  };
}
