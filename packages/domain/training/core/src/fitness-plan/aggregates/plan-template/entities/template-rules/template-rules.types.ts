import { z } from 'zod';
import { ExperienceLevelSchema } from '@/shared/index.js';

export const LocationTypeSchema = z.enum(['gym', 'home', 'outdoor']);
export type LocationType = z.infer<typeof LocationTypeSchema>;

export const CustomizableParameterSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['number', 'boolean', 'string', 'select']),
  label: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  defaultValue: z.union([z.number(), z.boolean(), z.string(), z.null()]),
  options: z.array(z.union([z.number(), z.boolean(), z.string()])).optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      required: z.boolean().optional(),
    })
    .optional(),
});
export type CustomizableParameter = z.infer<typeof CustomizableParameterSchema>;

export const TemplateRestrictionsSchema = z.object({
  noInjuries: z.array(z.string()).optional(),
  requiresEquipment: z.array(z.string()).optional(),
  requiresLocation: z.array(LocationTypeSchema).optional(),
  minSessionMinutes: z.number().optional(),
  maxSessionMinutes: z.number().optional(),
});
export type TemplateRestrictions = z.infer<typeof TemplateRestrictionsSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const TemplateRulesSchema = z.object({
  requiredEquipment: z.array(z.string()).optional(),
  minExperienceLevel: ExperienceLevelSchema,
  maxExperienceLevel: ExperienceLevelSchema,
  requiredDaysPerWeek: z.number().int().min(1).max(7).optional(),
  restrictions: TemplateRestrictionsSchema.optional(),
  customizableParameters: z.array(CustomizableParameterSchema).optional(),
});

/**
 * 2. INFER TYPES
 */
export type TemplateRules = Readonly<z.infer<typeof TemplateRulesSchema>>;
