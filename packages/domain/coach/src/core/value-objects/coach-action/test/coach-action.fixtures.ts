import { faker } from '@faker-js/faker';
import { CoachAction, CoachActionType } from '../coach-action.types.js';
import { coachActionFromPersistence } from '../coach-action.factory.js';

/**
 * Creates a CoachAction fixture for testing.
 * Uses coachActionFromPersistence to ensure branding and type safety.
 */
export function createCoachActionFixture(overrides?: Partial<CoachAction>): CoachAction {
  const data = {
    type: faker.helpers.arrayElement([
      'adjusted_plan',
      'suggested_rest_day',
      'encouraged',
      'scheduled_followup',
      'recommended_deload',
      'modified_exercise',
      'celebrated_win',
    ] as CoachActionType[]),
    details: faker.lorem.sentence(),
    appliedAt: faker.date.recent(),
    planChangeId: faker.datatype.boolean() ? faker.string.uuid() : undefined,
    ...overrides,
  };

  const result = coachActionFromPersistence(data as CoachAction);

  if (result.isFailure) {
    throw new Error(`Failed to create CoachAction fixture: ${ result.error }`);
  }

  return result.value;
}
