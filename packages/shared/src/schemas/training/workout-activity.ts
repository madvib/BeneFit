import { z } from 'zod';
import { ActivityStructureSchema } from './activity-structure.js';

// Workout Activity Schemas

export const ActivityTypeSchema = z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']);

export const WorkoutActivitySchema = z.object({
  name: z.string(),
  type: ActivityTypeSchema,
  order: z.number(),
  structure: ActivityStructureSchema.optional(),
  instructions: z.array(z.string()).optional(),
  distance: z.number().optional(), // meters
  duration: z.number().optional(), // minutes
  pace: z.string().optional(), // e.g., "easy", "moderate", "5:30/km"
  videoUrl: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  alternativeExercises: z.array(z.string()).optional(),
});

// Export inferred types
export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type WorkoutActivity = z.infer<typeof WorkoutActivitySchema>;
