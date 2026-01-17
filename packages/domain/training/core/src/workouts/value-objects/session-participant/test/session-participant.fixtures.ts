import { faker } from '@faker-js/faker';
import { SessionParticipant, ParticipantRole, ParticipantStatus } from '../session-participant.types.js';
import { createSessionParticipant } from '../session-participant.factory.js';

/**
 * Creates a mock SessionParticipant using the official factory
 */
export function createSessionParticipantFixture(overrides?: Partial<SessionParticipant>): SessionParticipant {
  const result = createSessionParticipant({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['owner', 'participant', 'spectator'] as ParticipantRole[]),
  });

  if (result.isFailure) {
    throw new Error(`Failed to create SessionParticipant fixture: ${ result.error }`);
  }

  // Allow overriding status and joinedAt which are set by default in factory
  return {
    ...result.value,
    status: faker.helpers.arrayElement(['active', 'paused', 'completed', 'left'] as ParticipantStatus[]),
    joinedAt: faker.date.recent(),
    completedActivities: faker.number.int({ min: 0, max: 5 }),
    ...overrides
  };
}
