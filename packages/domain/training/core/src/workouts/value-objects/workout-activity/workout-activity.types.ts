import { z } from 'zod';
import { ActivityStructureSchema } from '../activity-structure/index.js';
import { DomainBrandTag } from '@bene/shared';

export const ActivityTypeSchema = z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']);
export type ActivityType = z.infer<typeof ActivityTypeSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const WorkoutActivitySchema = z
  .object({
    name: z.string().min(1).max(100),
    type: ActivityTypeSchema,
    order: z.number().int().min(0).max(100),
    structure: ActivityStructureSchema.optional(),
    instructions: z.array(z.string()).optional(),
    distance: z.number().min(0).optional(),
    duration: z.number().min(0).optional(),
    pace: z.string().optional(),
    videoUrl: z.url().optional(),
    equipment: z.array(z.string()).optional(),
    alternativeExercises: z.array(z.string()).optional(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES
 */
export type WorkoutActivity = Readonly<z.infer<typeof WorkoutActivitySchema>>;

