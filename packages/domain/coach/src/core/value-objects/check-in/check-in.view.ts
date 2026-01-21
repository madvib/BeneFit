import { serializeForView } from '@bene/shared';
import { CheckIn, CheckInView } from './check-in.types.js';
import { toCoachActionView } from '../coach-action/index.js';

/**
 * Map CheckIn value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Maps nested CoachAction array
 */
export function toCheckInView(checkIn: CheckIn): CheckInView {
  const base = serializeForView(checkIn);

  return {
    ...base,
    actions: checkIn.actions.map(toCoachActionView),
  };
}
