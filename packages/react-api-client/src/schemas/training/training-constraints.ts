import { z } from 'zod';
import { EQUIPMENT_OPTIONS, PREFERRED_TRAINING_TIMES, INJURY_SEVERITY_LEVELS, TRAINING_LOCATIONS } from '@bene/shared';

export const UpdateTrainingConstraintsFormSchema = z.object({
  availableDays: z.array(z.string()).min(1, 'Select at least one day'),
  preferredTime: z.enum(PREFERRED_TRAINING_TIMES).optional(),
  maxDuration: z.number().min(1).max(300).optional(),
  availableEquipment: z.array(z.enum(EQUIPMENT_OPTIONS as unknown as [string, ...string[]])),
  location: z.enum(TRAINING_LOCATIONS),
  injuries: z.array(z.object({
    bodyPart: z.string().min(1, 'Body part is required').max(100),
    severity: z.enum(INJURY_SEVERITY_LEVELS),
    avoidExercises: z.array(z.string().min(1).max(200)),
    notes: z.string().max(500).optional(),
    reportedDate: z.coerce.date(),
  })).optional(),
});

export type UpdateTrainingConstraintsFormValues = z.input<typeof UpdateTrainingConstraintsFormSchema>;
