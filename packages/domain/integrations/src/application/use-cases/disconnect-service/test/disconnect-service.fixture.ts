import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createConnectedServiceFixture } from '@/fixtures.js';
import {
  toConnectedServiceView,
  ConnectedServiceCommands,
} from '@/core/index.js';
import type { DisconnectServiceResponse } from '../disconnect-service.js';

export type DisconnectServiceFixtureOptions = BaseFixtureOptions<DisconnectServiceResponse>;

/**
 * Build DisconnectServiceResponse fixture using domain fixture + view mapper
 * 
 * Pattern: Domain fixture → Disconnect command → View mapper → Use case response
 */
export function buildDisconnectServiceResponse(
  options: DisconnectServiceFixtureOptions = {}
): Result<DisconnectServiceResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to disconnect service');
  if (errorResult) return errorResult;

  // 1. Create domain fixture
  const service = createConnectedServiceFixture();

  // 2. Apply disconnect command
  const disconnectedService = ConnectedServiceCommands.disconnectService(service);

  // 3. Map to view (gives us computed fields for free)
  const view = toConnectedServiceView(disconnectedService);

  // 4. Apply any overrides and return
  return Result.ok({
    ...view,
    ...overrides,
  });
}
