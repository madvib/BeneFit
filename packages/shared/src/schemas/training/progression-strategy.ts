import { z } from 'zod';

// Progression Strategy Schemas

export const ProgressionTypeSchema = z.enum(['linear', 'undulating', 'adaptive']);

export const ProgressionStrategySchema = z.object({
  type: ProgressionTypeSchema,
  weeklyIncrease: z.number().optional(), // Percentage (0.1 = 10%)
  deloadWeeks: z.array(z.number()).optional(), // Week numbers to reduce load
  maxIncrease: z.number().optional(), // Cap on absolute increase per week
  minIncrease: z.number().optional(), // Minimum increase to be considered progression
  testWeeks: z.array(z.number()).optional(), // Weeks to assess progress
});

// Export inferred types
export type ProgressionType = z.infer<typeof ProgressionTypeSchema>;
export type ProgressionStrategy = z.infer<typeof ProgressionStrategySchema>;
