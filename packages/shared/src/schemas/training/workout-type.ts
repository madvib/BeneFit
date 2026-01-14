import { z } from 'zod';

export const WorkoutTypeSchema = z.enum([
  'strength',
  'cardio',
  'flexibility',
  'hybrid',
  'running',
  'cycling',
  'yoga',
  'hiit',
  'rest',
  'custom',
]);

export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;
