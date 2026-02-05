import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import { createCoachActionFixture } from '../../../../fixtures.js';
import {
  toCoachActionView
} from '@/core/index.js';
import type { RespondToCheckInResponse } from '../respond-to-check-in.js';

export type RespondToCheckInFixtureOptions = BaseFixtureOptions<RespondToCheckInResponse>;

/**
 * Build RespondToCheckInResponse fixture
 */
export function buildRespondToCheckInResponse(
  options: RespondToCheckInFixtureOptions = {}
): Result<RespondToCheckInResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to respond to check-in');
  if (errorResult) return errorResult;

  const action = createCoachActionFixture();

  return Result.ok({
    conversationId: faker.string.uuid(),
    coachAnalysis: faker.lorem.paragraph(),
    actions: [toCoachActionView(action)],
    ...overrides,
  });
}
