import { faker } from '@faker-js/faker';
import {
  buildConnectServiceResponse as _buildConnectServiceResponse,
  buildDisconnectServiceResponse as _buildDisconnectServiceResponse,
  buildGetConnectedServicesResponse as _buildGetConnectedServicesResponse,
  buildSyncServiceDataResponse as _buildSyncServiceDataResponse,
} from '@bene/integrations-domain/fixtures';
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
  overrides?: Parameters<typeof _buildConnectServiceResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildConnectServiceResponse(overrides);
}

export function buildDisconnectServiceResponse(
  overrides?: Parameters<typeof _buildDisconnectServiceResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildDisconnectServiceResponse(overrides);
}

export function buildGetConnectedServicesResponse(
  overrides?: Parameters<typeof _buildGetConnectedServicesResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetConnectedServicesResponse(overrides);
}

export function buildSyncServiceDataResponse(
  overrides?: Parameters<typeof _buildSyncServiceDataResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildSyncServiceDataResponse(overrides);
}
