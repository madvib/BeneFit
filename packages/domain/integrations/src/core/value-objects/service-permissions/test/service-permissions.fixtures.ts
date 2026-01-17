import { faker } from '@faker-js/faker';
import { ServicePermissions } from '../service-permission.js';

export function createServicePermissionsFixture(
  overrides?: Partial<ServicePermissions>
): ServicePermissions {
  return {
    readWorkouts: faker.datatype.boolean({ probability: 0.8 }),
    readHeartRate: faker.datatype.boolean({ probability: 0.7 }),
    readSleep: faker.datatype.boolean({ probability: 0.5 }),
    readNutrition: faker.datatype.boolean({ probability: 0.4 }),
    readBodyMetrics: faker.datatype.boolean({ probability: 0.6 }),
    writeWorkouts: faker.datatype.boolean({ probability: 0.3 }),
    ...overrides,
  };
}
