import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createCheckInFixture } from '../../../../fixtures.js';
import type { TriggerProactiveCheckInResponse } from '../trigger-proactive-check-in.js';

export type TriggerProactiveCheckInFixtureOptions = BaseFixtureOptions<TriggerProactiveCheckInResponse>;

/**
 * Build TriggerProactiveCheckInResponse fixture with Result<T> wrapper
 * 
 * Pattern: Domain fixture → Use case response wrapped in Result
 * Supports fuzzing mode for failure testing
 */
export function buildTriggerProactiveCheckInResponse(
  options: TriggerProactiveCheckInFixtureOptions = {}
): Result<TriggerProactiveCheckInResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to trigger check-in: User already has a pending check-in');
  if (errorResult) return errorResult;

  // Compose with domain fixture - ensure triggeredBy is set
  const checkIn = createCheckInFixture({ status: 'pending' });

  // Ensure type safety - triggeredBy must be defined
  if (!checkIn.triggeredBy) {
    throw new Error('CheckIn fixture must have triggeredBy');
  }

  return Result.ok({
    checkInId: checkIn.id,
    question: checkIn.question,
    triggeredBy: checkIn.triggeredBy,
    ...overrides,
  });
}
