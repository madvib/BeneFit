import { faker } from '@faker-js/faker';
import {
  buildGetCoachHistoryResponse as _buildGetCoachHistoryResponse,
  buildTriggerProactiveCheckInResponse as _buildTriggerProactiveCheckInResponse,
  buildSendMessageToCoachResponse as _buildSendMessageToCoachResponse,
  buildGenerateWeeklySummaryResponse as _buildGenerateWeeklySummaryResponse,
  buildDismissCheckInResponse as _buildDismissCheckInResponse,
  buildRespondToCheckInResponse as _buildRespondToCheckInResponse,
  type TriggerProactiveCheckInFixtureOptions,
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
  overrides?: Parameters<typeof _buildGetCoachHistoryResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);

  // This fixture returns raw data, not a Result wrapper
  return _buildGetCoachHistoryResponse(overrides);
}

export function buildTriggerProactiveCheckInResponse(
  overrides?: Parameters<typeof _buildTriggerProactiveCheckInResponse>[0],
  options?: TriggerProactiveCheckInFixtureOptions & FixtureOptions
) {
  applySeed(options);

  const result = _buildTriggerProactiveCheckInResponse(overrides, {
    success: options?.success ?? true, // Default to success for stories
    temperature: options?.temperature ?? 0,
  });

  if (result.isFailure) {
    throw new Error(`[Fixture] buildTriggerProactiveCheckInResponse failure: ${ result.errorMessage }`);
  }

  return result.value;
}

export function buildSendMessageToCoachResponse(
  overrides?: Parameters<typeof _buildSendMessageToCoachResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  // This builder doesn't return Result<T> yet
  return _buildSendMessageToCoachResponse(overrides);
}

export function buildGenerateWeeklySummaryResponse(
  overrides?: Parameters<typeof _buildGenerateWeeklySummaryResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGenerateWeeklySummaryResponse(overrides);
}

export function buildDismissCheckInResponse(
  overrides?: Parameters<typeof _buildDismissCheckInResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildDismissCheckInResponse(overrides);
}

export function buildRespondToCheckInResponse(
  overrides?: Parameters<typeof _buildRespondToCheckInResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildRespondToCheckInResponse(overrides);
}

/**
 * Re-export raw builders for advanced usage (return Result<T>)
 */
export {
  _buildGetCoachHistoryResponse as buildGetCoachHistoryResponseRaw,
  _buildTriggerProactiveCheckInResponse as buildTriggerProactiveCheckInResponseRaw,
};
