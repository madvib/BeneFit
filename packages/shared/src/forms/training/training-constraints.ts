import { z } from 'zod';
import {
  FITNESS_GOALS,
  EQUIPMENT_OPTIONS,
  PREFERRED_TIMES,
  INJURY_SEVERITY_LEVELS
} from '../../index.js';

// Fitness goals update form
export const UpdateFitnessGoalsFormSchema = z.object({
  primary: z.enum(FITNESS_GOALS as unknown as [string, ...string[]]),
  secondary: z.array(z.string()),
});

// Training constraints update form
// Derives from entity schema but picks only user-editable fields
export const UpdateTrainingConstraintsFormSchema = z.object({
  availableDays: z.array(z.string()).min(1, 'Select at least one day'),
  preferredTime: z.enum(PREFERRED_TIMES).optional(),
  maxDuration: z.number().min(15).max(180),
  availableEquipment: z.array(z.enum(EQUIPMENT_OPTIONS as unknown as [string, ...string[]])),
  injuries: z.array(z.object({
    bodyPart: z.string(),
    severity: z.enum(INJURY_SEVERITY_LEVELS),
    description: z.string(),
  })),
});

export type UpdateFitnessGoalsFormValues = z.infer<typeof UpdateFitnessGoalsFormSchema>;
export type UpdateTrainingConstraintsFormValues = z.infer<typeof UpdateTrainingConstraintsFormSchema>;
