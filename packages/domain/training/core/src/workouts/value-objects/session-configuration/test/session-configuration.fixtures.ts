import { faker } from '@faker-js/faker';
import { SessionConfiguration } from '../session-configuration.types.js';
import { createSessionConfiguration } from '../session-configuration.factory.js';

/**
 * Creates a mock SessionConfiguration using the official factory
 */
export function createSessionConfigurationFixture(overrides?: Partial<SessionConfiguration>): SessionConfiguration {
  const isMultiplayer = overrides?.isMultiplayer ?? faker.datatype.boolean();

  const result = createSessionConfiguration({
    isMultiplayer,
    isPublic: faker.datatype.boolean(),
    maxParticipants: isMultiplayer ? faker.number.int({ min: 2, max: 10 }) : 1,
    allowSpectators: faker.datatype.boolean(),
    enableChat: faker.datatype.boolean(),
    enableVoiceAnnouncements: faker.datatype.boolean(),
    showOtherParticipantsProgress: faker.datatype.boolean(),
    autoAdvanceActivities: faker.datatype.boolean(),
    ...overrides,
  });

  if (result.isFailure) {
    throw new Error(`Failed to create SessionConfiguration fixture: ${ result.error }`);
  }

  return result.value;
}
