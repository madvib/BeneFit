import { connectedServices } from './connected_services.ts';
import { integrationSyncLog } from './integration_sync_log.ts';

export * from './connected_services.ts';
export * from './integration_sync_log.ts';

export const integrations_schema = {
  connectedServices,
  integrationSyncLog,
};
