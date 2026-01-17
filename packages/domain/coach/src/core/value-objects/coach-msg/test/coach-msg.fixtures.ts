import { faker } from '@faker-js/faker';
import { CoachMsg } from '../coach-msg.types.js';
import { createCoachActionFixture } from '../../coach-action/test/coach-action.fixtures.js';

export function createCoachMsgFixture(overrides?: Partial<CoachMsg>): CoachMsg {
  const role = overrides?.role || faker.helpers.arrayElement(['user', 'coach', 'system'] as const);

  return {
    id: faker.string.uuid(),
    role,
    content: faker.lorem.paragraph(),
    actions: role === 'coach' && faker.datatype.boolean()
      ? faker.helpers.multiple(() => createCoachActionFixture(), { count: { min: 1, max: 3 } })
      : undefined,
    checkInId: faker.datatype.boolean() ? faker.string.uuid() : undefined,
    timestamp: faker.date.recent({ days: 30 }),
    tokens: faker.number.int({ min: 50, max: 500 }),
    ...overrides,
  };
}
