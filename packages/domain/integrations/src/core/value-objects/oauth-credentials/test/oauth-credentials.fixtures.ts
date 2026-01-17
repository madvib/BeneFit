import { faker } from '@faker-js/faker';
import { OAuthCredentials } from '../oauth-credentials.js';

export function createOAuthCredentialsFixture(
  overrides?: Partial<OAuthCredentials>
): OAuthCredentials {
  const expiresAt = faker.datatype.boolean()
    ? faker.date.future({ years: 0.1 }) // Expires in the future
    : undefined;

  return {
    accessToken: faker.string.alphanumeric(64),
    refreshToken: faker.datatype.boolean() ? faker.string.alphanumeric(64) : undefined,
    expiresAt,
    scopes: faker.helpers.arrayElements(
      ['read:workouts', 'read:heart_rate', 'read:sleep', 'write:workouts'],
      { min: 1, max: 4 }
    ),
    tokenType: faker.helpers.arrayElement(['Bearer', 'OAuth'] as const),
    ...overrides,
  };
}
