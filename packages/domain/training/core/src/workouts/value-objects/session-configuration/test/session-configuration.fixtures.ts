import { faker } from '@faker-js/faker';
import { SessionConfiguration } from '../session-configuration.types.js';
import { sessionConfigurationFromPersistence } from '../session-configuration.factory.js';

/**
 * Creates a mock SessionConfiguration using sessionConfigurationFromPersistence.
 */
export function createSessionConfigurationFixture(overrides?: Partial<SessionConfiguration>): SessionConfiguration {
  const isMultiplayer = overrides?.isMultiplayer ?? faker.datatype.boolean();

  // Build unbranded data with faker
  const data = {
    isMultiplayer,
    isPublic: faker.datatype.boolean(),
    maxParticipants: isMultiplayer ? faker.number.int({ min: 2, max: 10 }) : 1,
    allowSpectators: faker.datatype.boolean(),
    enableChat: faker.datatype.boolean(),
    enableVoiceAnnouncements: faker.datatype.boolean(),
    showOtherParticipantsProgress: faker.datatype.boolean(),
    autoAdvanceActivities: faker.datatype.boolean(),
    ...overrides,
  };

  // Rehydrate through fromPersistence
  const result = sessionConfigurationFromPersistence(data);

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create SessionConfiguration fixture: ${ errorMsg }`);
  }

  return result.value;
}
