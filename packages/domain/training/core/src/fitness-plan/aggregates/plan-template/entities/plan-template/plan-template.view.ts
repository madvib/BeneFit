import { CreateView } from '@bene/shared';
import { PlanTemplate } from './plan-template.types.js';
import { TemplateStructureView, toTemplateStructureView } from '../template-structure/index.js';
import { TemplateRulesView, toTemplateRulesView } from '../template-rules/index.js';
import * as Queries from './plan-template.queries.js';

/**
 * 3. VIEW TYPES
 */
export type PlanTemplateView = CreateView<
  PlanTemplate,
  'structure' | 'rules',
  {
    structure: TemplateStructureView;
    rules: TemplateRulesView;
    estimatedDuration: {
      minWeeks: number;
      maxWeeks: number;
    };
    frequency: {
      minWorkouts: number;
      maxWorkouts: number;
    };
  }
>;


export function toPlanTemplateView(template: PlanTemplate): PlanTemplateView {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    author: { ...template.author },
    tags: [...template.tags],
    structure: toTemplateStructureView(template.structure),
    rules: toTemplateRulesView(template.rules),
    metadata: {
      ...template.metadata,
      createdAt: template.metadata.createdAt.toISOString(),
      updatedAt: template.metadata.updatedAt.toISOString(),
      publishedAt: template.metadata.publishedAt?.toISOString(),
    },
    previewWorkouts: template.previewWorkouts ? template.previewWorkouts.map(ws => ({ ...ws })) : undefined,
    version: template.version,

    // Computed
    estimatedDuration: Queries.estimateTemplateDuration(template),
    frequency: Queries.getTemplateFrequency(template),
  };
}
