import { faker } from '@faker-js/faker';
import { ServiceMetadata } from '../service-metadata.js';

export function createServiceMetadataFixture(
  overrides?: Partial<ServiceMetadata>
): ServiceMetadata {
  const supportsWebhooks = faker.datatype.boolean({ probability: 0.7 });

  return {
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
}
