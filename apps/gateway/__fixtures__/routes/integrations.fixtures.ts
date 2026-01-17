import { faker } from '@faker-js/faker';
import { fake } from '../setup.js';
import {
  ConnectServiceClientSchema,
  DisconnectServiceClientSchema,
} from '../../src/routes/integrations.js';
import {
  GetConnectedServicesRequestSchema,
  GetConnectedServicesResponseSchema,
  SyncServiceDataRequestSchema,
  SyncServiceDataResponseSchema,
  ConnectServiceResponseSchema,
  DisconnectServiceResponseSchema,
} from '@bene/integrations-domain';

/**
 * Fixtures for integration route request/response schemas
 */

// Pre-built request fixtures (using client schemas from routes)
export const connectServiceRequest = fake(ConnectServiceClientSchema);

export const disconnectServiceRequest = fake(DisconnectServiceClientSchema);

export const getConnectedServicesRequest = fake(GetConnectedServicesRequestSchema);

export const syncServiceDataRequest = fake(SyncServiceDataRequestSchema);

// Pre-built response fixtures
export const connectServiceResponse = fake(ConnectServiceResponseSchema);

export const disconnectServiceResponse = fake(DisconnectServiceResponseSchema);

export const getConnectedServicesResponse = fake(GetConnectedServicesResponseSchema);

export const syncServiceDataResponse = fake(SyncServiceDataResponseSchema);

/**
 * Helper functions for creating fixtures with overrides and optional seeding
 */

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

interface FixtureOptions {
  seed?: number;
}

// Request helpers
export function createConnectServiceRequest(
  overrides?: DeepPartial<typeof connectServiceRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(ConnectServiceClientSchema), ...overrides };
}

export function createDisconnectServiceRequest(
  overrides?: DeepPartial<typeof disconnectServiceRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(DisconnectServiceClientSchema), ...overrides };
}

export function createGetConnectedServicesRequest(
  overrides?: DeepPartial<typeof getConnectedServicesRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetConnectedServicesRequestSchema), ...overrides };
}

export function createSyncServiceDataRequest(
  overrides?: DeepPartial<typeof syncServiceDataRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(SyncServiceDataRequestSchema), ...overrides };
}

// Response helpers
export function createConnectServiceResponse(
  overrides?: DeepPartial<typeof connectServiceResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(ConnectServiceResponseSchema), ...overrides };
}

export function createDisconnectServiceResponse(
  overrides?: DeepPartial<typeof disconnectServiceResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(DisconnectServiceResponseSchema), ...overrides };
}

export function createGetConnectedServicesResponse(
  overrides?: DeepPartial<typeof getConnectedServicesResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetConnectedServicesResponseSchema), ...overrides };
}

export function createSyncServiceDataResponse(
  overrides?: DeepPartial<typeof syncServiceDataResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(SyncServiceDataResponseSchema), ...overrides };
}

