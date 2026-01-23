import { CreateView, serializeForView } from '@bene/shared';
import { ConnectedService } from './connected-service.types.js';
import * as Queries from './connected-service.queries.js';
import {
  toSyncStatusView,
  SyncStatusView,
  toServiceMetadataView,
  ServiceMetadataView
} from '@/core/value-objects/index.js';

/**
 * 3. VIEW TYPES (Serialized, with credentials omitted for security)
 */
export type ConnectedServiceView = CreateView<
  ConnectedService,
  'credentials',
  {
    syncStatus: SyncStatusView;
    metadata: ServiceMetadataView;
    hasValidCredentials: boolean;
    isSyncHealthy: boolean;
    totalSyncedItems: number;
    timeSinceLastSync: number | null;
    needsCredentialRefresh: boolean;
  }
>;


/**
 * Map ConnectedService aggregate to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Omits credentials (security)
 * - Adds computed fields for sync health monitoring
 */
export function toConnectedServiceView(service: ConnectedService): ConnectedServiceView {
  const base = serializeForView(service);

  return {
    ...base,
    syncStatus: toSyncStatusView(service.syncStatus),
    metadata: toServiceMetadataView(service.metadata),

    hasValidCredentials: !!service.credentials.accessToken,
    isSyncHealthy: Queries.isSyncHealthy(service),
    totalSyncedItems: Queries.getTotalSyncedItems(service),
    timeSinceLastSync: Queries.getTimeSinceLastSync(service),
    needsCredentialRefresh: Queries.needsCredentialRefresh(service),
  };
}
