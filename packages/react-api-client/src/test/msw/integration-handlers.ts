import { http, delay } from 'msw';
import {
  buildGetConnectedServicesResponse,
  buildConnectServiceResponse,
  buildDisconnectServiceResponse,
  buildSyncServiceDataResponse,
} from '../../fixtures/integrations.js';
import { toHttpResponse } from './utils.js';

export const integrationHandlers = [
  http.get('*/api/integrations/connected', async () => {
    await delay(100);
    return toHttpResponse(buildGetConnectedServicesResponse());
  }),

  http.post('*/api/integrations/connect', async () => {
    await delay(300);
    return toHttpResponse(buildConnectServiceResponse());
  }),

  http.post('*/api/integrations/disconnect', async () => {
    await delay(150);
    return toHttpResponse(buildDisconnectServiceResponse());
  }),

  http.post('*/api/integrations/sync', async () => {
    await delay(500);
    return toHttpResponse(buildSyncServiceDataResponse());
  }),
];

export const integrationScenarios = {
  default: integrationHandlers,

  loading: [
    http.get('*/api/integrations/connected', async () => {
      await delay('infinite');
      return toHttpResponse(buildGetConnectedServicesResponse());
    }),
  ],

  error: [
    http.get('*/api/integrations/connected', async () => {
      await delay(100);
      return toHttpResponse(buildGetConnectedServicesResponse({ success: false }));
    }),
  ],

  empty: [
    http.get('*/api/integrations/connected', async () => {
      await delay(100);
      return toHttpResponse({ services: [] });
    }),
  ]
};
