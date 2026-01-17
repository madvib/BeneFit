import { z } from 'zod';
import { ExperienceProfile } from './experience-profile.types.js';

export const ExperienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const TrainingHistorySchema = z.object({
  yearsTraining: z.number().int().min(0).max(80).optional(),
  previousPrograms: z.array(z.string().min(1).max(100)),
  sports: z.array(z.string().min(1).max(50)),
  certifications: z.array(z.string().min(1).max(100)),
});

export const CurrentCapabilitiesSchema = z.object({
  canDoFullPushup: z.boolean(),
  canDoFullPullup: z.boolean(),
  canRunMile: z.boolean(),
  canSquatBelowParallel: z.boolean(),
  estimatedMaxes: z.object({
    squat: z.number().min(0).max(500).optional(),
    bench: z.number().min(0).max(400).optional(),
    deadlift: z.number().min(0).max(600).optional(),
    unit: z.enum(['kg', 'lbs']),
  }).optional(),
});

export const ExperienceProfileSchema = z.object({
  level: ExperienceLevelSchema,
  history: TrainingHistorySchema,
  capabilities: CurrentCapabilitiesSchema,
  lastAssessmentDate: z.iso.datetime(),
});

export type ExperienceProfilePresentation = z.infer<typeof ExperienceProfileSchema>;

// DOMAIN to PRESENTATION (Schema)
export function toExperienceProfileSchema(profile: ExperienceProfile): ExperienceProfilePresentation {
  return {
    level: profile.level,
    history: {
      ...profile.history,
      previousPrograms: [...profile.history.previousPrograms],
      sports: [...profile.history.sports],
      certifications: [...profile.history.certifications],
    },
    capabilities: {
      ...profile.capabilities,
      estimatedMaxes: profile.capabilities.estimatedMaxes ? { ...profile.capabilities.estimatedMaxes } : undefined,
    },
    lastAssessmentDate: profile.lastAssessmentDate.toISOString(),
  };
}

// PRESENTATION (Schema) to DOMAIN
export function fromExperienceProfileSchema(schema: ExperienceProfilePresentation): ExperienceProfile {
  return {
    level: schema.level,
    history: {
      ...schema.history,
      previousPrograms: [...schema.history.previousPrograms],
      sports: [...schema.history.sports],
      certifications: [...schema.history.certifications],
    },
    capabilities: {
      ...schema.capabilities,
      estimatedMaxes: schema.capabilities.estimatedMaxes ? { ...schema.capabilities.estimatedMaxes } : undefined,
    },
    lastAssessmentDate: new Date(schema.lastAssessmentDate),
  };
}
