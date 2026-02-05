import { faker } from '@faker-js/faker';
import { ServicePermissions } from '../service-permissions.types.js';
import { servicePermissionsFromPersistence } from '../service-permissions.factory.js';

/**
 * Creates a ServicePermissions fixture for testing.
 * Uses servicePermissionsFromPersistence to ensure branding and type safety.
 */
export function createServicePermissionsFixture(
  overrides?: Partial<ServicePermissions>,
): ServicePermissions {
  const data = {
    readWorkouts: faker.datatype.boolean({ probability: 0.8 }),
    readHeartRate: faker.datatype.boolean({ probability: 0.7 }),
    readSleep: faker.datatype.boolean({ probability: 0.5 }),
    readNutrition: faker.datatype.boolean({ probability: 0.4 }),
    readBodyMetrics: faker.datatype.boolean({ probability: 0.6 }),
    writeWorkouts: faker.datatype.boolean({ probability: 0.3 }),
    ...overrides,
  };

  const result = servicePermissionsFromPersistence(data as ServicePermissions);

  if (result.isFailure) {
    throw new Error(`Failed to create ServicePermissions fixture: ${ result.error }`);
  }

  return result.value;
}
