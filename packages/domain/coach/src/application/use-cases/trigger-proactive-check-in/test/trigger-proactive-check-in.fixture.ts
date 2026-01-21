import { faker } from '@faker-js/faker';
import { Result } from '@bene/shared';
import { createCheckInFixture } from '../../../../fixtures.js';
import type { TriggerProactiveCheckInResponse } from '../trigger-proactive-check-in.js';

export interface TriggerProactiveCheckInFixtureOptions {
  success?: boolean;      // If false, return failure
  temperature?: number;   // 0-1 probability of failure (for fuzzing)
}

/**
 * Build TriggerProactiveCheckInResponse fixture with Result<T> wrapper
 * 
 * Pattern: Domain fixture → Use case response wrapped in Result
 * Supports fuzzing mode for failure testing
 */
export function buildTriggerProactiveCheckInResponse(
  overrides?: Partial<TriggerProactiveCheckInResponse>,
  options: TriggerProactiveCheckInFixtureOptions = { success: true, temperature: 0 }
): Result<TriggerProactiveCheckInResponse> {
  // Fuzzing mode - random failures based on temperature
  if (!options.success || faker.datatype.boolean({ probability: options.temperature })) {
    return Result.fail(new Error('Failed to trigger check-in: User already has a pending check-in'));
  }

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
