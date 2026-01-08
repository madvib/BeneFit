import { z } from 'zod';
import { EQUIPMENT_OPTIONS, FITNESS_GOALS } from '@bene/shared';

// Helper to convert readonly arrays to mutable tuples for Zod
function asMutable<T extends string>(readonlyArray: readonly T[]): [T, ...T[]] {
  return readonlyArray as unknown as [T, ...T[]];
}

export const OnboardingSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  location: z.string().optional(),
  bio: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  primaryGoal: z.enum(asMutable(FITNESS_GOALS)),
  secondaryGoals: z.array(z.string()), // Keep flexible or use SECONDARY_GOALS if strictly matching UI
  daysPerWeek: z.number().min(1).max(7),
  minutesPerWorkout: z.number().min(1),
  equipment: z.array(z.enum(asMutable(EQUIPMENT_OPTIONS))),
});

export type OnboardingFormValues = z.infer<typeof OnboardingSchema>;
export const UpdateFitnessGoalsSchema = z.object({
  primary: z.enum(asMutable(FITNESS_GOALS)),
  secondary: z.array(z.string()),
});

export const UpdateTrainingConstraintsSchema = z.object({
  availableDays: z.array(z.string()).min(1, 'Select at least one day'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  maxDuration: z.number().min(15).max(180),
  availableEquipment: z.array(z.enum(asMutable(EQUIPMENT_OPTIONS))),
  injuries: z.array(z.object({
    bodyPart: z.string(),
    severity: z.enum(['minor', 'moderate', 'serious']),
    description: z.string(),
  })),
});

export type UpdateFitnessGoalsFormValues = z.infer<typeof UpdateFitnessGoalsSchema>;
export type UpdateTrainingConstraintsFormValues = z.infer<typeof UpdateTrainingConstraintsSchema>;
