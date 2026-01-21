import { CreateView, serializeForView } from '@bene/shared';
import { WorkoutPerformance } from './workout-performance.types.js';


export type WorkoutPerformanceView = CreateView<WorkoutPerformance>;

export function toWorkoutPerformanceView(
  performance: WorkoutPerformance,
): WorkoutPerformanceView {
  const base = serializeForView(performance);
  return {
    ...base,

  };
}
