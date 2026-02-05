import { CreateView, serializeForView } from '@bene/shared';
import { Reaction } from './reaction.types.js';


/**
 * 3. VIEW TYPES (Serialized)
 */
export type ReactionView = CreateView<Reaction>;

/**
 * Map Reaction entity to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 */
export function toReactionView(reaction: Reaction): ReactionView {
  return serializeForView(reaction);
}
