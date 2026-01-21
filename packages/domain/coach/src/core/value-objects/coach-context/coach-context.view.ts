import { CreateView, serializeForView } from '@bene/shared';
import { CoachContext } from './coach-context.types.js';

export type CoachContextView = CreateView<CoachContext>;

/**
 * Map CoachContext value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string (in nested RecentWorkoutSummary)
 * - Maps nested composed types
 */
export function toCoachContextView(context: CoachContext): CoachContextView {
  return serializeForView(context);
}
