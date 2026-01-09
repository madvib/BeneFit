import { z } from 'zod';
import {
  ExperienceLevelSchema,
  FITNESS_GOALS,
  EQUIPMENT_OPTIONS
} from '../../index.js';

// Onboarding form schema
// This is the unified onboarding form for initial profile creation

export const OnboardingFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  location: z.string().optional(),
  bio: z.string().optional(),
  experienceLevel: ExperienceLevelSchema,
  primaryGoal: z.enum(FITNESS_GOALS as unknown as [string, ...string[]]),
  secondaryGoals: z.array(z.string()),
  daysPerWeek: z.number().min(1).max(7),
  minutesPerWorkout: z.number().min(1),
  equipment: z.array(z.enum(EQUIPMENT_OPTIONS as unknown as [string, ...string[]])),
});

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
