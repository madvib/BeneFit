import { serializeForView } from '@bene/shared';
import { SyncStatus, SyncStatusView } from './sync-status.types.js';

/**
 * Map SyncStatus value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 */
export function toSyncStatusView(status: SyncStatus): SyncStatusView {
  return serializeForView(status);
}
