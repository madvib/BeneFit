import { z } from 'zod';

export const PlanPositionSchema = z.object({
  week: z.number().int().min(1).max(52, 'Week must be between 1 and 52'),
  day: z.number().int().min(0).max(6, 'Day must be 0-6 (Sunday-Saturday)'),
}).readonly();

export type PlanPosition = z.infer<typeof PlanPositionSchema>;
