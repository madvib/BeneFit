import { z } from 'zod';
import {
  type CreateView,
  type DomainBrandTag,
  INJURY_SEVERITY_LEVELS,
  PREFERRED_TRAINING_TIMES,
  TRAINING_LOCATIONS,
} from '@bene/shared';

export const InjurySeveritySchema = z.enum(INJURY_SEVERITY_LEVELS);
export type InjurySeverity = z.infer<typeof InjurySeveritySchema>;

export const PreferredTimeSchema = z.enum(PREFERRED_TRAINING_TIMES);
export type PreferredTime = z.infer<typeof PreferredTimeSchema>;

export const TrainingLocationSchema = z.enum(TRAINING_LOCATIONS);
export type TrainingLocation = z.infer<typeof TrainingLocationSchema>;

export const InjuryPropsSchema = z
  .object({
    bodyPart: z.string().min(1).max(100),
    severity: InjurySeveritySchema,
    avoidExercises: z.array(z.string().min(1).max(200)),
    notes: z.string().max(500).optional(),
    reportedDate: z.coerce.date<Date>(),
  })
export type Injury = Readonly<z.infer<typeof InjuryPropsSchema>>;

export const TrainingConstraintsSchema = z
  .object({
    injuries: z.array(InjuryPropsSchema).optional(),
    availableDays: z.array(z.string().min(1).max(20)), // e.g. ["Monday"]
    preferredTime: PreferredTimeSchema.optional(),
    maxDuration: z.number().int().min(1).max(300).optional(), // minutes
    availableEquipment: z.array(z.string().min(1).max(100)),
    location: TrainingLocationSchema,
  })
  .brand<DomainBrandTag>();

export type TrainingConstraints = Readonly<z.infer<typeof TrainingConstraintsSchema>>;
export type TrainingConstraintsView = CreateView<TrainingConstraints>;
