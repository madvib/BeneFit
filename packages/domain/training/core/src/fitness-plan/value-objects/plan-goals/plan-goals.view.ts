import { CreateView, serializeForView } from '@bene/shared';
import { PlanGoals } from './plan-goals.types.js';


export type PlanGoalsView = CreateView<PlanGoals>;

/**
 * Map PlanGoals value object to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Strips domain brand
 */
export function toPlanGoalsView(goals: PlanGoals): PlanGoalsView {
  return serializeForView(goals);
}
