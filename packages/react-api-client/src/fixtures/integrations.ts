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
import { type WithSeed, applySeed } from './utils.js';

/**
 * Integrations HTTP response builders
 * Simple wrappers that add seed control to domain fixtures
 */

export function buildConnectServiceResponse(
  options: WithSeed<Parameters<typeof _buildConnectServiceResponse>[0]> = {}
): Result<ConnectServiceResponse> {
  applySeed(options);
  return _buildConnectServiceResponse(options);
}

export function buildDisconnectServiceResponse(
  options: WithSeed<Parameters<typeof _buildDisconnectServiceResponse>[0]> = {}
): Result<DisconnectServiceResponse> {
  applySeed(options);
  return _buildDisconnectServiceResponse(options);
}

export function buildGetConnectedServicesResponse(
  options: WithSeed<Parameters<typeof _buildGetConnectedServicesResponse>[0]> = {}
): Result<GetConnectedServicesResponse> {
  applySeed(options);
  return _buildGetConnectedServicesResponse(options);
}

export function buildSyncServiceDataResponse(
  options: WithSeed<Parameters<typeof _buildSyncServiceDataResponse>[0]> = {}
): Result<SyncServiceDataResponse> {
  applySeed(options);
  return _buildSyncServiceDataResponse(options);
}
