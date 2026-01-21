import { createConnectedServiceFixture } from '../../../../fixtures.js';
import {
  toConnectedServiceView,
} from '@core/index.js';
import type { ConnectServiceResponse } from '../connect-service.js';

/**
 * Build ConnectServiceResponse fixture using domain fixture + view mapper
 * 
 * Pattern: Domain fixture → View mapper → Use case response
 */
export function buildConnectServiceResponse(
  overrides?: Partial<ConnectServiceResponse>
): ConnectServiceResponse {
  // 1. Create domain fixture
  const service = createConnectedServiceFixture();

  // 2. Map to view (gives us computed fields for free)
  const view = toConnectedServiceView(service);

  // 3. Apply any overrides and return
  return {
    ...view,
    ...overrides,
  };
}
