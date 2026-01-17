import { z } from 'zod';

export const ProgressionTypeSchema = z.enum(['linear', 'undulating', 'adaptive']);

export const ProgressionStrategySchema = z.object({
  type: ProgressionTypeSchema,
  weeklyIncrease: z.number().min(0).max(1).optional(),
  deloadWeeks: z.array(z.number().int().min(1).max(52)).optional(),
  maxIncrease: z.number().min(0).max(1).optional(),
  minIncrease: z.number().min(0).max(1).optional(),
  testWeeks: z.array(z.number().int().min(1).max(52)).optional(),
});
