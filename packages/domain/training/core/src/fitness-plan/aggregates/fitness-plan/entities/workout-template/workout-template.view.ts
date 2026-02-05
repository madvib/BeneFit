import { CreateView, serializeForView } from '@bene/shared';
import { WorkoutTemplate } from './workout-template.types.js';
import { toWorkoutActivityView } from '@/workouts/index.js';
import { getEstimatedDuration, isPastDue, isCompleted } from './workout-template.queries.js';

/**
 * VIEW INTERFACE (API Presentation)
 */
export type WorkoutTemplateView = CreateView<
  WorkoutTemplate,
  never,
  {

    // Computed fields from queries
    estimatedDuration: number;
    isPastDue: boolean;
    isCompleted: boolean;
  }
>;

/**
 * Map WorkoutTemplate entity to view model (API presentation)
 * Notes: 
 * - Dates are converted to ISO strings automatically by serializeForView
 * - Activities are mapped to their view representation
 * - Enriched with computed properties (estimatedDuration, isPastDue)
 */
export function toWorkoutTemplateView(template: WorkoutTemplate): WorkoutTemplateView {
  const base = serializeForView(template);

  return {
    ...base,
    alternatives: template.alternatives?.map(({ activities, ...rest }) => ({
      ...rest,
      activities: activities.map(toWorkoutActivityView),
    })),
    activities: template.activities.map(toWorkoutActivityView),
    estimatedDuration: getEstimatedDuration(template),
    isPastDue: isPastDue(template),
    isCompleted: isCompleted(template),
  };
}
