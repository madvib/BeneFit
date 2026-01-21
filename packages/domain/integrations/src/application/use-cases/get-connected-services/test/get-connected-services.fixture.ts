import { createConnectedServiceFixture } from '../../../../fixtures.js';
import {
  toConnectedServiceView,
} from '@core/index.js';
import type { GetConnectedServicesResponse } from '../get-connected-services.js';

/**
 * Build GetConnectedServicesResponse fixture using domain fixtures + view mapper
 * 
 * Pattern: Domain fixtures → View mappers → Use case response
 */
export function buildGetConnectedServicesResponse(
  overrides?: Partial<GetConnectedServicesResponse>
): GetConnectedServicesResponse {
  // 1. Create domain fixtures (array)
  const service1 = createConnectedServiceFixture();
  const service2 = createConnectedServiceFixture();

  // 2. Map to views
  const services = [service1, service2].map(toConnectedServiceView);

  // 3. Apply any overrides and return
  return {
    services,
    ...overrides,
  };
}
