import { z } from 'zod';
import { TemplateRules } from './template-rules.types.js';

import { ExperienceLevelSchema } from '@bene/shared';

export const LocationTypeSchema = z.enum(['gym', 'home', 'outdoor']);

export const CustomizableParameterSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(['number', 'boolean', 'string', 'select']),
  label: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  defaultValue: z.union([z.number(), z.boolean(), z.string(), z.null()]),
  options: z.array(z.union([z.number(), z.boolean(), z.string()])).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    required: z.boolean().optional(),
  }).optional(),
});

export const TemplateRestrictionsSchema = z.object({
  noInjuries: z.array(z.string().min(1).max(100)).optional(),
  requiresEquipment: z.array(z.string().min(1).max(100)).optional(),
  requiresLocation: z.array(LocationTypeSchema).optional(),
  minSessionMinutes: z.number().int().min(1).max(120).optional(),
  maxSessionMinutes: z.number().int().min(1).max(240).optional(),
});

export const TemplateRulesSchema = z.object({
  requiredEquipment: z.array(z.string().min(1).max(100)).optional(),
  minExperienceLevel: ExperienceLevelSchema,
  maxExperienceLevel: ExperienceLevelSchema,
  requiredDaysPerWeek: z.number().int().min(1).max(7).optional(),
  restrictions: TemplateRestrictionsSchema.optional(),
  customizableParameters: z.array(CustomizableParameterSchema).optional(),
});

type TemplateRulesSchema = z.infer<typeof TemplateRulesSchema>;

export function toTemplateRulesSchema(rules: TemplateRules): TemplateRulesSchema {
  return {
    requiredEquipment: rules.requiredEquipment ? [...rules.requiredEquipment] : undefined,
    minExperienceLevel: rules.minExperienceLevel,
    maxExperienceLevel: rules.maxExperienceLevel,
    requiredDaysPerWeek: rules.requiredDaysPerWeek,
    restrictions: rules.restrictions ? {
      ...rules.restrictions,
      noInjuries: rules.restrictions.noInjuries ? [...rules.restrictions.noInjuries] : undefined,
      requiresEquipment: rules.restrictions.requiresEquipment ? [...rules.restrictions.requiresEquipment] : undefined,
      requiresLocation: rules.restrictions.requiresLocation ? [...rules.restrictions.requiresLocation] : undefined,
    } : undefined,
    customizableParameters: rules.customizableParameters ? rules.customizableParameters.map(p => ({
      ...p,
      options: p.options ? [...p.options] : undefined,
    })) : undefined,
  };
}
