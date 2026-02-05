import { CreateView, serializeForView } from '@bene/shared';
import { toTrainingConstraintsView } from '@/shared/value-objects/index.js';
import { toPlanGoalsView } from '@/fitness-plan/value-objects/index.js';
import { WeeklyScheduleView, toWeeklyScheduleView } from '../weekly-schedule/index.js';
import { toWorkoutTemplateView, WorkoutTemplateView } from '../workout-template/index.js';
import { FitnessPlan } from './fitness-plan.types.js';
import * as Queries from './fitness-plan.queries.js';

/**
 * VIEW INTERFACE (API Presentation)
 */

export type FitnessPlanView = CreateView<
  FitnessPlan,
  'templateId',
  {
    currentWorkout?: WorkoutTemplateView;
    currentWeek?: WeeklyScheduleView;
    summary: {
      total: number;
      completed: number;
    };
  }
>;

/**
 * Map FitnessPlan entity to view model (API presentation)
 *
 * - Serializes Date → ISO string
 * - Enriches with computed fields (currentWorkout, currentWeek, summary)
 * - Omits internal fields (templateId)
 */
export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  const currentWorkout = Queries.getCurrentWorkout(plan);
  const currentWeek = Queries.getCurrentWeek(plan);
  const summary = Queries.getWorkoutSummary(plan);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { templateId: _templateId, ...base } = serializeForView(plan);
  return {
    ...base,
    // Domain fields needing ViewSafe conversion
    weeks: plan.weeks.map(toWeeklyScheduleView),
    constraints: toTrainingConstraintsView(plan.constraints),
    goals: toPlanGoalsView(plan.goals),
    // Enriched fields
    currentWorkout: currentWorkout ? toWorkoutTemplateView(currentWorkout) : undefined,
    currentWeek: currentWeek ? toWeeklyScheduleView(currentWeek) : undefined,
    summary,
  };
}
