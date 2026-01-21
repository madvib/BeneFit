import { faker } from '@faker-js/faker';
import { ServiceMetadata } from '../service-metadata.types.js';
import { serviceMetadataFromPersistence } from '../service-metadata.factory.js';

/**
 * Creates a ServiceMetadata fixture for testing.
 * Uses serviceMetadataFromPersistence to ensure branding and type safety.
 */
export function createServiceMetadataFixture(
  overrides?: Partial<ServiceMetadata>
): ServiceMetadata {
  const supportsWebhooks = faker.datatype.boolean({ probability: 0.7 });

  const data = {
    externalUserId: faker.string.uuid(),
    externalUsername: faker.internet.username(),
    profileUrl: faker.internet.url(),
    athleteType: faker.helpers.arrayElement(['runner', 'cyclist', 'triathlete', 'general']),
    units: faker.helpers.arrayElement(['metric', 'imperial'] as const),
    supportsWebhooks,
    webhookRegistered: supportsWebhooks ? faker.datatype.boolean() : false,
    webhookUrl: supportsWebhooks && faker.datatype.boolean() ? faker.internet.url() : undefined,
    ...overrides,
  };

  const result = serviceMetadataFromPersistence(data as ServiceMetadata);

  if (result.isFailure) {
    throw new Error(`Failed to create ServiceMetadata fixture: ${ result.error }`);
  }

  return result.value;
}
