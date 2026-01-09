import { z } from 'zod';
import { EXPERIENCE_LEVELS } from '../../constants/index.js';

// Experience Profile Schemas

export const ExperienceLevelSchema = z.enum(EXPERIENCE_LEVELS);

export const TrainingHistorySchema = z.object({
  yearsTraining: z.number().optional(),
  previousPrograms: z.array(z.string()), // "Starting Strength", "Couch to 5K", etc.
  sports: z.array(z.string()), // Sports background
  certifications: z.array(z.string()), // Any fitness certs
});

export const CurrentCapabilitiesSchema = z.object({
  canDoFullPushup: z.boolean(),
  canDoFullPullup: z.boolean(),
  canRunMile: z.boolean(),
  canSquatBelowParallel: z.boolean(),
  estimatedMaxes: z.object({
    squat: z.number().optional(),
    bench: z.number().optional(),
    deadlift: z.number().optional(),
    unit: z.enum(['kg', 'lbs']),
  }).optional(),
});

export const ExperienceProfileSchema = z.object({
  level: ExperienceLevelSchema,
  history: TrainingHistorySchema,
  capabilities: CurrentCapabilitiesSchema,
  lastAssessmentDate: z.string(), // Date serialized as ISO string
});

export type TrainingHistory = z.infer<typeof TrainingHistorySchema>;
export type CurrentCapabilities = z.infer<typeof CurrentCapabilitiesSchema>;
export type ExperienceProfile = z.infer<typeof ExperienceProfileSchema>;
