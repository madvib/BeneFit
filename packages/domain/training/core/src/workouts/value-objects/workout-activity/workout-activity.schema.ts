import { z } from 'zod';
import { ActivityStructureSchema, toActivityStructureSchema } from '../activity-structure/activity-structure.schema.js';
import { WorkoutActivity } from './workout-activity.types.js';

export const ActivityTypeSchema = z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']);

export const WorkoutActivitySchema = z.object({
  name: z.string().min(1).max(100),
  type: ActivityTypeSchema,
  order: z.number().int().min(0).max(20),
  structure: ActivityStructureSchema.optional(),
  instructions: z.array(z.string().min(1).max(200)).optional(),
  distance: z.number().min(0).max(100000).optional(), // meters
  duration: z.number().int().min(0).max(7200).optional(), // seconds
  pace: z.string().min(1).max(20).optional(),
  videoUrl: z.url().optional(),
  equipment: z.array(z.string().min(1).max(50)).optional(),
  alternativeExercises: z.array(z.string().min(1).max(100)).optional(),
});

type WorkoutActivitySchema = z.infer<typeof WorkoutActivitySchema>;

export function toWorkoutActivitySchema(activity: WorkoutActivity): WorkoutActivitySchema {
  return {
    name: activity.name,
    type: activity.type,
    order: activity.order,
    structure: activity.structure ? toActivityStructureSchema(activity.structure) : undefined,
    instructions: activity.instructions ? [...activity.instructions] : undefined,
    distance: activity.distance,
    duration: activity.duration,
    pace: activity.pace,
    videoUrl: activity.videoUrl,
    equipment: activity.equipment ? [...activity.equipment] : undefined,
    alternativeExercises: activity.alternativeExercises ? [...activity.alternativeExercises] : undefined,
  };
}
