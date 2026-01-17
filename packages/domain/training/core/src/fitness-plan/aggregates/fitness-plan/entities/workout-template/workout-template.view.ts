import type { WorkoutTemplate } from './workout-template.types.js';

// TODO: Add WorkoutTemplateView interface to workout-template.types.ts
// For now, just pass through (no transformation needed)
export type WorkoutTemplateView = WorkoutTemplate;

export function toWorkoutTemplateView(template: WorkoutTemplate): WorkoutTemplateView {
  // TODO: Implement proper view mapping when view interface is defined
  return template as WorkoutTemplateView;
}
