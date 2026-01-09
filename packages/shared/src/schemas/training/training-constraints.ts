import { z } from 'zod';
import {
  EQUIPMENT_OPTIONS,
  INJURY_SEVERITY_LEVELS,
  PREFERRED_TIMES,
  TRAINING_LOCATIONS
} from '../../constants/index.js';

// Training Constraints Schemas

export const InjurySeveritySchema = z.enum(INJURY_SEVERITY_LEVELS);
export const PreferredTimeSchema = z.enum(PREFERRED_TIMES);
export const TrainingLocationSchema = z.enum(TRAINING_LOCATIONS);

export const InjurySchema = z.object({
  bodyPart: z.string(),
  severity: InjurySeveritySchema,
  avoidExercises: z.array(z.string()),
  notes: z.string().optional(),
  reportedDate: z.string(), // ISO date
});

export const TrainingConstraintsSchema = z.object({
  injuries: z.array(InjurySchema).optional(),
  availableDays: z.array(z.string()), // ['Monday', 'Wednesday', 'Friday']
  preferredTime: PreferredTimeSchema.optional(),
  maxDuration: z.number().optional(), // minutes per workout
  availableEquipment: z.array(z.enum(EQUIPMENT_OPTIONS as unknown as [string, ...string[]])),
  location: TrainingLocationSchema,
});

export type Injury = z.infer<typeof InjurySchema>;
export type TrainingConstraints = z.infer<typeof TrainingConstraintsSchema>;
