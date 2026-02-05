import { serializeForView } from '@bene/shared';
import { CoachAction, CoachActionView } from './coach-action.types.js';

/**
 * Map CoachAction value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 */
export function toCoachActionView(action: CoachAction): CoachActionView {
  return serializeForView(action);
}
