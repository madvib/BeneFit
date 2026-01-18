import { z } from 'zod';

export const PlanPositionSchema = z.object({
  week: z.number().int().min(1).max(52),
  day: z.number().int().min(1).max(365),
});
