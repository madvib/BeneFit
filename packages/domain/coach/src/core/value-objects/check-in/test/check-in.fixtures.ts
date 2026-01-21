import { faker } from '@faker-js/faker';
import { CheckIn, CheckInType, CheckInTrigger } from '../check-in.types.js';
import { createCoachActionFixture } from '../../coach-action/test/coach-action.fixtures.js';
import { checkInFromPersistence } from '../check-in.factory.js';

/**
 * Creates a CheckIn fixture for testing.
 * Uses checkInFromPersistence to ensure branding and type safety.
 */
export function createCheckInFixture(overrides?: Partial<CheckIn>): CheckIn {
  const status = faker.helpers.arrayElement(['pending', 'responded', 'dismissed'] as const);

  const data = {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['proactive', 'scheduled', 'user_initiated'] as CheckInType[]),
    triggeredBy: faker.helpers.arrayElement([
      'low_adherence',
      'high_exertion',
      'injury_reported',
      'weekly_review',
      'milestone_achieved',
      'streak_broken',
      'difficulty_pattern',
      'enjoyment_declining',
    ] as CheckInTrigger[]),
    question: faker.lorem.sentence() + '?',
    userResponse: status === 'responded' ? faker.lorem.paragraph() : undefined,
    coachAnalysis: status === 'responded' ? faker.lorem.paragraph() : undefined,
    actions: faker.helpers.multiple(() => createCoachActionFixture(), { count: { min: 0, max: 3 } }),
    status,
    createdAt: faker.date.recent({ days: 7 }),
    respondedAt: status === 'responded' ? faker.date.recent({ days: 5 }) : undefined,
    dismissedAt: status === 'dismissed' ? faker.date.recent({ days: 5 }) : undefined,
    ...overrides,
  };

  const result = checkInFromPersistence(data as CheckIn);

  if (result.isFailure) {
    throw new Error(`Failed to create CheckIn fixture: ${ result.error }`);
  }

  return result.value;
}
