import { connectedServices } from './connected_services';
import { integrationSyncLog } from './integration_sync_log';

export * from './connected_services';
export * from './integration_sync_log';

export const integrations_schema = {
  connectedServices,
  integrationSyncLog,
};
