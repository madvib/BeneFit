import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import type { GenerateWeeklySummaryResponse } from '../generate-weekly-summary.js';

export type GenerateWeeklySummaryFixtureOptions = BaseFixtureOptions<GenerateWeeklySummaryResponse>;

/**
 * Build GenerateWeeklySummaryResponse fixture
 */
export function buildGenerateWeeklySummaryResponse(
  options: GenerateWeeklySummaryFixtureOptions = {}
): Result<GenerateWeeklySummaryResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to generate weekly summary');
  if (errorResult) return errorResult;
  //TODO should have a domain entity for weekly summary
  return Result.ok({
    summary: faker.lorem.paragraphs(2),
    highlights: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence()
    ],
    suggestions: [
      faker.lorem.sentence(),
      faker.lorem.sentence()
    ],
    ...overrides
  });
}
