import { z } from 'zod';
import { INTENSITY_LEVELS, EXPERIENCE_LEVELS } from '@bene/shared';

/**
 * 🛰️ UBIQUITOUS DOMAIN SCHEMAS
 * 
 * Only schemas that are used across multiple primary domain modules (e.g. Workouts, 
 * Plans, and Profile) live here to prevent circular dependencies or mass replication.
 */

export const IntensityLevelSchema = z.enum(INTENSITY_LEVELS);
export const ExperienceLevelSchema = z.enum(EXPERIENCE_LEVELS);
export type IntensityLevel = z.infer<typeof IntensityLevelSchema>;
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;

