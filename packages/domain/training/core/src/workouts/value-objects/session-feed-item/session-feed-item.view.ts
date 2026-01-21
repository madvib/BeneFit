import { serializeForView } from '@bene/shared';
import { SessionFeedItem, SessionFeedItemView } from './session-feed-item.types.js';

/**
 * Map SessionFeedItem value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 */
export function toSessionFeedItemView(item: SessionFeedItem): SessionFeedItemView {
  return serializeForView(item);
}
