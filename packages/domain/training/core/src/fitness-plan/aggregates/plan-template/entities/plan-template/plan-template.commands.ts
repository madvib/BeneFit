import { Guard, Result } from '@bene/shared-domain';
import { PlanTemplate } from './plan-template.types.js';
import { CreateTemplateParams } from './plan-template.factory.js';

export function publishTemplate(template: PlanTemplate): Result<PlanTemplate> {
  const guardResult = Guard.isTrue(
    template.metadata.publishedAt === undefined,
    'Template is already published',
  );
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...template,
    metadata: {
      ...template.metadata,
      isPublic: true,
      publishedAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export function unpublishTemplate(template: PlanTemplate): Result<PlanTemplate> {
  return Result.ok({
    ...template,
    metadata: {
      ...template.metadata,
      isPublic: false,
      publishedAt: undefined,
      updatedAt: new Date(),
    },
  });
}

export function verifyTemplate(template: PlanTemplate): Result<PlanTemplate> {
  return Result.ok({
    ...template,
    metadata: {
      ...template.metadata,
      isVerified: true,
      updatedAt: new Date(),
    },
  });
}

export function featureTemplate(template: PlanTemplate): Result<PlanTemplate> {
  const guardResult = Guard.isTrue(
    template.metadata.isVerified,
    'Only verified templates can be featured',
  );
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...template,
    metadata: {
      ...template.metadata,
      isFeatured: true,
      updatedAt: new Date(),
    },
  });
}

export function incrementUsageCount(template: PlanTemplate): Result<PlanTemplate> {
  return Result.ok({
    ...template,
    metadata: {
      ...template.metadata,
      usageCount: template.metadata.usageCount + 1,
      updatedAt: new Date(),
    },
  });
}

export function updateTemplateRating(
  template: PlanTemplate,
  newRating: number,
): Result<PlanTemplate> {
  const guardResult = Guard.inRange(newRating, 0, 5, 'rating');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...template,
    metadata: {
      ...template.metadata,
      rating: newRating,
      updatedAt: new Date(),
    },
  });
}

export function createTemplateRevision(
  template: PlanTemplate,
  updates: Partial<Omit<CreateTemplateParams, 'structure' | 'rules'>>,
): Result<PlanTemplate> {
  return Result.ok({
    ...template,
    ...updates,
    metadata: {
      ...template.metadata,
      isPublic: false,
      publishedAt: undefined,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    version: template.version + 1,
  });
}
