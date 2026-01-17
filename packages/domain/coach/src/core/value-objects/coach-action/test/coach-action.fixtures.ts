import { faker } from '@faker-js/faker';
import { CoachAction, CoachActionType } from '../coach-action.types.js';

export function createCoachActionFixture(overrides?: Partial<CoachAction>): CoachAction {
  return {
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
}
