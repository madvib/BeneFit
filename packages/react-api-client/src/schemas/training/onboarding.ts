import { z } from 'zod';
import { FITNESS_GOALS, EQUIPMENT_OPTIONS, EXPERIENCE_LEVELS, SECONDARY_GOALS } from '@bene/shared';

/**
 * Onboarding form schema for initial profile creation.
 * Note: This form is a UI-optimized composite that is transformed into 
 * a CreateProfileRequest in the submission handler.
 */
export const OnboardingFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  location: z.string().optional(),
  bio: z.string().optional(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  primaryGoal: z.enum(FITNESS_GOALS),
  secondaryGoals: z.array(z.enum(SECONDARY_GOALS)),
  daysPerWeek: z.number().min(1).max(7),
  minutesPerWorkout: z.number().min(1),
  equipment: z.array(z.enum(EQUIPMENT_OPTIONS as unknown as [string, ...string[]])),
});

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
