import { faker } from '@faker-js/faker';
import { OAuthCredentials } from '../oauth-credentials.types.js';
import { oauthCredentialsFromPersistence } from '../oauth-credentials.factory.js';

/**
 * Creates an OAuthCredentials fixture for testing.
 * Uses oauthCredentialsFromPersistence to ensure branding and type safety.
 */
export function createOAuthCredentialsFixture(
  overrides?: Partial<OAuthCredentials>
): OAuthCredentials {
  const expiresAt = faker.datatype.boolean()
    ? faker.date.future({ years: 0.1 }) // Expires in the future
    : undefined;

  const data = {
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

  const result = oauthCredentialsFromPersistence(data as OAuthCredentials);

  if (result.isFailure) {
    throw new Error(`Failed to create OAuthCredentials fixture: ${ result.error }`);
  }

  return result.value;
}
