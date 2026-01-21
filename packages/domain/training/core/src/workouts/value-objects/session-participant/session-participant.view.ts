import { CreateView, serializeForView } from '@bene/shared';
import { SessionParticipant } from './session-participant.types.js';


/**
 * 3. VIEW TYPES
 */
export type SessionParticipantView = CreateView<SessionParticipant>;

/**
 * Map SessionParticipant value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 */
export function toSessionParticipantView(
  participant: SessionParticipant,
): SessionParticipantView {
  return serializeForView(participant);
}
