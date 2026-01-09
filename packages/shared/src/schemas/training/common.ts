import { z } from 'zod';

// Common schemas used across multiple entity schemas

export const TargetWeightSchema = z.object({
  current: z.number(),
  target: z.number(),
  unit: z.enum(['kg', 'lbs']),
});

export const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  earnedAt: z.string(), // ISO date string
});

// Export inferred types
export type TargetWeight = z.infer<typeof TargetWeightSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
