import { createConnectedServiceFixture } from '../../../../fixtures.js';
import {
  toConnectedServiceView,
  ConnectedServiceCommands,
} from '@core/index.js';
import type { DisconnectServiceResponse } from '../disconnect-service.js';

/**
 * Build DisconnectServiceResponse fixture using domain fixture + view mapper
 * 
 * Pattern: Domain fixture → Disconnect command → View mapper → Use case response
 */
export function buildDisconnectServiceResponse(
  overrides?: Partial<DisconnectServiceResponse>
): DisconnectServiceResponse {
  // 1. Create domain fixture
  const service = createConnectedServiceFixture();

  // 2. Apply disconnect command
  const disconnectedService = ConnectedServiceCommands.disconnectService(service);

  // 3. Map to view (gives us computed fields for free)
  const view = toConnectedServiceView(disconnectedService);

  // 4. Apply any overrides and return
  return {
    ...view,
    ...overrides,
  };
}
