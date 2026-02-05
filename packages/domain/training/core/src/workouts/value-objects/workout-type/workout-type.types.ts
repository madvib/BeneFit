import { z } from 'zod';
import { WORKOUT_TYPES } from '@bene/shared';

export const WorkoutTypeSchema = z.enum(WORKOUT_TYPES);
export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;