import { faker } from '@faker-js/faker';
import type { GenerateWeeklySummaryResponse } from '../generate-weekly-summary.js';

/**
 * Build GenerateWeeklySummaryResponse fixture
 */
export function buildGenerateWeeklySummaryResponse(
  overrides?: Partial<GenerateWeeklySummaryResponse>
): GenerateWeeklySummaryResponse {
  return {
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
  };
}
