import { z } from 'zod';
import { ExperienceLevelSchema } from '@/shared/index.js';

export const TrainingHistorySchema = z.object({
  yearsTraining: z.number().min(0).max(100).optional(),
  previousPrograms: z.array(z.string().min(1).max(200)),
  sports: z.array(z.string().min(1).max(100)),
  certifications: z.array(z.string().min(1).max(200)),
});
export type TrainingHistory = z.infer<typeof TrainingHistorySchema>;

export const CurrentCapabilitiesSchema = z.object({
  canDoFullPushup: z.boolean(),
  canDoFullPullup: z.boolean(),
  canRunMile: z.boolean(),
  canSquatBelowParallel: z.boolean(),
  estimatedMaxes: z
    .object({
      squat: z.number().min(0).max(1000).optional(),
      bench: z.number().min(0).max(1000).optional(),
      deadlift: z.number().min(0).max(1000).optional(),
      unit: z.enum(['kg', 'lbs']),
    })
    .optional(),
});
export type CurrentCapabilities = z.infer<typeof CurrentCapabilitiesSchema>;

/**
 * CORE SCHEMA
 */
export const ExperienceProfileSchema = z.object({
  level: ExperienceLevelSchema,
  history: TrainingHistorySchema,
  capabilities: CurrentCapabilitiesSchema,
  lastAssessmentDate: z.coerce.date<Date>(),
});

/**
 * INFERRED TYPES
 */
export type ExperienceProfile = Readonly<z.infer<typeof ExperienceProfileSchema>>;
