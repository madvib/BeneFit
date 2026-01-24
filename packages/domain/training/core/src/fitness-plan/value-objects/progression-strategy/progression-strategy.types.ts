import { z } from 'zod';
import { PROGRESSION_STRATEGIES } from '@bene/shared';

export const ProgressionTypeSchema = z.enum(PROGRESSION_STRATEGIES);
export type ProgressionType = z.infer<typeof ProgressionTypeSchema>;

export const ProgressionStrategySchema = z
  .object({
    type: ProgressionTypeSchema,
    weeklyIncrease: z.number().min(0).max(1).optional(),
    deloadWeeks: z.array(z.number().int().min(1).max(52)).optional(),
    maxIncrease: z.number().min(0).max(1).optional(),
    minIncrease: z.number().min(0).max(1).optional(),
    testWeeks: z.array(z.number().int().min(1).max(52)).optional(),
  })
  .readonly();

export type ProgressionStrategy = z.infer<typeof ProgressionStrategySchema>;
