import { Guard, Result } from '@shared';
import { TemplateRules } from '../template-rules/template-rules.types.js';
import { TemplateStructure } from '../template-structure/template-structure.types.js';
import { TemplateAuthor, WorkoutPreview, PlanTemplate } from './plan-template.types.js';

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
    id: crypto.randomUUID(),
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
