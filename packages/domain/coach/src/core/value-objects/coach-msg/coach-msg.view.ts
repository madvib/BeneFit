import { serializeForView } from '@bene/shared';
import { CoachMsg, CoachMsgView } from './coach-msg.types.js';
import { toCoachActionView } from '../coach-action/index.js';

/**
 * Map CoachMsg value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Maps nested CoachAction array
 */
export function toCoachMsgView(msg: CoachMsg): CoachMsgView {
  const base = serializeForView(msg);

  return {
    ...base,
    actions: msg.actions?.map(toCoachActionView),
  };
}
