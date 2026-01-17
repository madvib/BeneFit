import { z } from 'zod';
import { PlanTemplate } from './plan-template.types.js';
import { TemplateRulesSchema, toTemplateRulesSchema } from '../template-rules/template-rules.presentation.js';
import { TemplateStructureSchema, toTemplateStructureSchema } from '../template-structure/template-structure.presentation.js';
import * as Queries from './plan-template.queries.js';


export const TemplateAuthorSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1).max(100),
  credentials: z.string().min(1).max(200).optional(),
});

export const TemplateMetadataSchema = z.object({
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  isVerified: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
  usageCount: z.number().int().min(0).max(1000000),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  publishedAt: z.iso.datetime().optional(),
});

export const WorkoutPreviewSchema = z.object({
  weekNumber: z.number().int().min(1).max(52),
  dayOfWeek: z.number().int().min(0).max(6),
  workoutSummary: z.string().min(1).max(200),
});

export const PlanTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  author: TemplateAuthorSchema,
  tags: z.array(z.string().min(1).max(50)),
  structure: TemplateStructureSchema,
  rules: TemplateRulesSchema,
  metadata: TemplateMetadataSchema,
  previewWorkouts: z.array(WorkoutPreviewSchema).optional(),
  version: z.number().int().min(1).max(1000),

  // Computed / Enriched Fields
  estimatedDuration: z.object({
    minWeeks: z.number().int().min(1).max(52),
    maxWeeks: z.number().int().min(1).max(52),
  }),
  frequency: z.object({
    minWorkouts: z.number().int().min(0).max(7),
    maxWorkouts: z.number().int().min(0).max(7),
  }),
});

export type PlanTemplatePresentation = z.infer<typeof PlanTemplateSchema>;

export function toPlanTemplateSchema(template: PlanTemplate): PlanTemplatePresentation {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    author: { ...template.author },
    tags: [...template.tags],
    structure: toTemplateStructureSchema(template.structure),
    rules: toTemplateRulesSchema(template.rules),
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
