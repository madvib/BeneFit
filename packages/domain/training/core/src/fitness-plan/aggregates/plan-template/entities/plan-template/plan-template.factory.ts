import { randomUUID } from 'crypto';
import { Guard, Result } from '@bene/shared';
import { WorkoutPreview } from '@/fitness-plan/value-objects/index.js';
import { type TemplateRules, toTemplateRulesView } from '../template-rules/index.js';
import { type TemplateStructure, toTemplateStructureView } from '../template-structure/index.js';
import { TemplateAuthor, PlanTemplate, PlanTemplateView } from './plan-template.types.js';
import { estimateTemplateDuration, getTemplateFrequency } from './plan-template.queries.js';

export interface CreateTemplateParams {
  name: string;
  description: string;
  author: TemplateAuthor;
  tags: string[];
  structure: TemplateStructure;
  rules: TemplateRules;
  isPublic?: boolean;
  previewWorkouts?: WorkoutPreview[];
  version?: number;
}

export function createPlanTemplate(params: CreateTemplateParams): Result<PlanTemplate> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: params.name, argumentName: 'name' },
      { argument: params.description, argumentName: 'description' },
      { argument: params.author, argumentName: 'author' },
      { argument: params.tags, argumentName: 'tags' },
      { argument: params.structure, argumentName: 'structure' },
      { argument: params.rules, argumentName: 'rules' },
    ]),
    Guard.againstEmptyString(params.name, 'name'),
    Guard.againstTooLong(params.name, 200, 'name'),
    Guard.againstTooLong(params.description, 1000, 'description'),
    Guard.againstNullOrUndefined(params.author.name, 'author.name'),
  ]);

  if (guardResult.isFailure) return Result.fail(guardResult.error);

  const now = new Date();
  const version = params.version ?? 1; // Default to 1 if not provided

  return Result.ok({
    id: randomUUID(),
    name: params.name,
    description: params.description,
    author: params.author,
    tags: params.tags,
    structure: params.structure,
    rules: params.rules,
    metadata: {
      isPublic: params.isPublic ?? false,
      isFeatured: false,
      isVerified: false,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    },
    previewWorkouts: params.previewWorkouts,
    version: version,
  });
}

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
    estimatedDuration: estimateTemplateDuration(template),
    frequency: getTemplateFrequency(template),
  };
}
