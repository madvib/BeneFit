// Export all parts of the TemplateRules entity
export type {
  TemplateRules,
  TemplateRestrictions,
  LocationType,
  CustomizableParameter,
  TemplateRulesView,
} from './template-rules.types.js';
export { createTemplateRules, toTemplateRulesView } from './template-rules.factory.js';
export * from './test/template-rules.fixtures.js';
export * from './template-rules.schema.js';
