import { z } from 'zod';
import { DomainBrandTag } from '@bene/shared';
import {

  WorkoutPreviewSchema,
} from '@/fitness-plan/value-objects/workout-preview/index.js';
import {

  TemplateStructureSchema,
} from '../template-structure/index.js';
import {
  TemplateRulesSchema,
} from '../template-rules/index.js';

export const TemplateAuthorSchema = z.object({
  userId: z.uuid().optional(),
  name: z.string().min(1).max(100),
  credentials: z.string().min(1).max(200).optional(),
});
export type TemplateAuthor = z.infer<typeof TemplateAuthorSchema>;

export const TemplateMetadataSchema = z.object({
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  isVerified: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
  usageCount: z.number().int().min(0).max(1000000),
  createdAt: z.coerce.date<Date>(),
  updatedAt: z.coerce.date<Date>(),
  publishedAt: z.coerce.date<Date>().optional(),
});
export type TemplateMetadata = z.infer<typeof TemplateMetadataSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const PlanTemplateSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    author: TemplateAuthorSchema,
    tags: z.array(z.string().min(1).max(50)),
    structure: TemplateStructureSchema,
    rules: TemplateRulesSchema,
    metadata: TemplateMetadataSchema,
    previewWorkouts: z.array(WorkoutPreviewSchema).optional(),
    version: z.number().int().min(1).max(1000),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES
 */

export type PlanTemplate = Readonly<z.infer<typeof PlanTemplateSchema>>;

