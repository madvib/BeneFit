import { serializeForView } from '@bene/shared';
import { TemplateRules } from './template-rules.types.js';


export type TemplateRulesView = TemplateRules;


export function toTemplateRulesView(_rules: TemplateRules): TemplateRulesView {
  return serializeForView(_rules)

}
