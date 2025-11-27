// Export all parts of the PlanTemplate entity
export type { PlanTemplate, TemplateAuthor, TemplateMetadata, WorkoutPreview } from './plan-template.types.js';
export { createPlanTemplate } from './plan-template.factory.js';
export type { CreateTemplateParams } from './plan-template.factory.js';
export * as PlanTemplateCommands from './plan-template.commands.js';
export * as PlanTemplateQueries from './plan-template.queries.js';
