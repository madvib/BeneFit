import { faker } from '@faker-js/faker';
import {
  buildGetCoachHistoryResponse as _buildGetCoachHistoryResponse,
  buildTriggerProactiveCheckInResponse as _buildTriggerProactiveCheckInResponse,
  buildSendMessageToCoachResponse as _buildSendMessageToCoachResponse,
  buildGenerateWeeklySummaryResponse as _buildGenerateWeeklySummaryResponse,
  buildDismissCheckInResponse as _buildDismissCheckInResponse,
  buildRespondToCheckInResponse as _buildRespondToCheckInResponse,
} from '@bene/coach-domain/fixtures';
import { type FixtureOptions } from './utils.js';

/**
 * Coach HTTP response builders
 * Unwrap domain Result<T> fixtures into HTTP-ready response data
 */

function applySeed(options?: FixtureOptions) {
  if (options?.seed !== undefined) {
    faker.seed(options.seed);
  }
}

export function buildGetCoachHistoryResponse(
  options: Parameters<typeof _buildGetCoachHistoryResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetCoachHistoryResponse(options);
}

export function buildTriggerProactiveCheckInResponse(
  options: Parameters<typeof _buildTriggerProactiveCheckInResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildTriggerProactiveCheckInResponse(options);
}

export function buildSendMessageToCoachResponse(
  options: Parameters<typeof _buildSendMessageToCoachResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildSendMessageToCoachResponse(options);
}

export function buildGenerateWeeklySummaryResponse(
  options: Parameters<typeof _buildGenerateWeeklySummaryResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGenerateWeeklySummaryResponse(options);
}

export function buildDismissCheckInResponse(
  options: Parameters<typeof _buildDismissCheckInResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildDismissCheckInResponse(options);
}

export function buildRespondToCheckInResponse(
  options: Parameters<typeof _buildRespondToCheckInResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildRespondToCheckInResponse(options);
}

/**
 * Re-export raw builders for advanced usage (return Result<T>)
 * @deprecated Use the standard builders instead as they now return Result<T>
 */
export {
  _buildGetCoachHistoryResponse as buildGetCoachHistoryResponseRaw,
  _buildTriggerProactiveCheckInResponse as buildTriggerProactiveCheckInResponseRaw,
};
