import { connectedServices } from './connected_services.js';
import { integrationSyncLog } from './integration_sync_log.js';

export * from './connected_services.js';
export * from './integration_sync_log.js';

export const integrationsSchema = {
  connectedServices,
  integrationSyncLog,
};
