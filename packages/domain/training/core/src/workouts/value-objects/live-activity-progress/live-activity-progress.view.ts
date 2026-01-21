import { serializeForView } from '@bene/shared';
import { LiveActivityProgress, LiveActivityProgressView } from './live-activity-progress.types.js';

/**
 * Map LiveActivityProgress value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 */
export function toLiveActivityProgressView(
  progress: LiveActivityProgress,
): LiveActivityProgressView {
  return serializeForView(progress);
}
