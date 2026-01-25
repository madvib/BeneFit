import { faker } from '@faker-js/faker';
import { Result } from '@bene/shared';
import {
  buildConnectServiceResponse as _buildConnectServiceResponse,
  buildDisconnectServiceResponse as _buildDisconnectServiceResponse,
  buildGetConnectedServicesResponse as _buildGetConnectedServicesResponse,
  buildSyncServiceDataResponse as _buildSyncServiceDataResponse,
} from '@bene/integrations-domain/fixtures';
import type {
  ConnectServiceResponse,
  DisconnectServiceResponse,
  GetConnectedServicesResponse,
  SyncServiceDataResponse,
} from '@bene/integrations-domain';
import { type FixtureOptions } from './utils.js';

/**
 * Integrations HTTP response builders
 * Simple wrappers that add seed control to domain fixtures
 */

function applySeed(options?: FixtureOptions) {
  if (options?.seed !== undefined) {
    faker.seed(options.seed);
  }
}

export function buildConnectServiceResponse(
  options: Parameters<typeof _buildConnectServiceResponse>[0] = {},
  fixtureOptions?: FixtureOptions
): Result<ConnectServiceResponse> {
  applySeed(fixtureOptions);
  return _buildConnectServiceResponse(options);
}

export function buildDisconnectServiceResponse(
  options: Parameters<typeof _buildDisconnectServiceResponse>[0] = {},
  fixtureOptions?: FixtureOptions
): Result<DisconnectServiceResponse> {
  applySeed(fixtureOptions);
  return _buildDisconnectServiceResponse(options);
}

export function buildGetConnectedServicesResponse(
  options: Parameters<typeof _buildGetConnectedServicesResponse>[0] = {},
  fixtureOptions?: FixtureOptions
): Result<GetConnectedServicesResponse> {
  applySeed(fixtureOptions);
  return _buildGetConnectedServicesResponse(options);
}

export function buildSyncServiceDataResponse(
  options: Parameters<typeof _buildSyncServiceDataResponse>[0] = {},
  fixtureOptions?: FixtureOptions
): Result<SyncServiceDataResponse> {
  applySeed(fixtureOptions);
  return _buildSyncServiceDataResponse(options);
}
