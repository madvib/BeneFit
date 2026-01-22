import { http, delay } from 'msw';
import {
  buildGetConnectedServicesResponse,
  buildConnectServiceResponse,
  buildDisconnectServiceResponse,
  buildSyncServiceDataResponse,
} from '../../fixtures/integrations.js';
import { toHttpResponse } from './utils.js';

export const integrationHandlers = [
  http.get('http://*/api/integrations/connected', async () => {
    await delay(100);
    return toHttpResponse(buildGetConnectedServicesResponse());
  }),

  http.post('http://*/api/integrations/connect', async () => {
    await delay(300);
    return toHttpResponse(buildConnectServiceResponse());
  }),

  http.post('http://*/api/integrations/disconnect', async () => {
    await delay(150);
    return toHttpResponse(buildDisconnectServiceResponse());
  }),

  http.post('http://*/api/integrations/sync', async () => {
    await delay(500);
    return toHttpResponse(buildSyncServiceDataResponse());
  }),
];
