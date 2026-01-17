import { toWeeklyScheduleView } from '../weekly-schedule/weekly-schedule.view.js';
import { toWorkoutTemplateView } from '../workout-template/workout-template.view.js';
import type { FitnessPlan, FitnessPlanView } from './fitness-plan.types.js';
import * as Queries from './fitness-plan.queries.js';

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

  return {
    // Entity fields (auto-typed via Omit)
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    description: plan.description,
    planType: plan.planType,
    goals: plan.goals,
    progression: plan.progression,
    constraints: plan.constraints,
    weeks: plan.weeks.map(toWeeklyScheduleView),
    status: plan.status,
    currentPosition: plan.currentPosition,

    // Date serialization
    startDate: plan.startDate.toISOString(),
    endDate: plan.endDate?.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt?.toISOString(),

    // Enriched fields
    currentWorkout: currentWorkout ? toWorkoutTemplateView(currentWorkout) : undefined,
    currentWeek: currentWeek ? toWeeklyScheduleView(currentWeek) : undefined,
    summary,
  };
}
