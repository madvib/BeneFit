// Export all parts of the WorkoutTemplate entity
export type { WorkoutAlternative, WorkoutTemplate, WorkoutCategory, WorkoutImportance, WorkoutStatus, WorkoutType } from './workout-template.types.js';
export { createWorkoutTemplate } from './workout-template.factory.js';
export * as WorkoutTemplateCommands from './workout-template.commands.js';
export * as WorkoutTemplateQueries from './workout-template.queries.js';
