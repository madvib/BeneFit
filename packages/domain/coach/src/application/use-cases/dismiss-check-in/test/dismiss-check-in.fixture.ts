import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import type { DismissCheckInResponse } from '../dismiss-check-in.js';

export type DismissCheckInFixtureOptions = BaseFixtureOptions<DismissCheckInResponse>;

/**
 * Build DismissCheckInResponse fixture
 */
export function buildDismissCheckInResponse(
  options: DismissCheckInFixtureOptions = {}
): Result<DismissCheckInResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to dismiss check-in');
  if (errorResult) return errorResult;

  return Result.ok({
    conversationId: faker.string.uuid(),
    dismissed: true,
    ...overrides,
  });
}
