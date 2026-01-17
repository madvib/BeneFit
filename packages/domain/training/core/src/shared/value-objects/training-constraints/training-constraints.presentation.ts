import { z } from 'zod';
import type { TrainingConstraints } from './training-constraints.types.js';

export const InjurySchema = z.object({
  bodyPart: z.string(),
  severity: z.enum(['minor', 'moderate', 'serious']),
  avoidExercises: z.array(z.string()),
  notes: z.string().optional(),
  reportedDate: z.string(), // ISO date
});

export const TrainingConstraintsSchema = z.object({
  injuries: z.array(InjurySchema).optional(),
  availableDays: z.array(z.string()),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  maxDuration: z.number().optional(),
  availableEquipment: z.array(z.string()),
  location: z.enum(['home', 'gym', 'outdoor', 'mixed']),
});

export type TrainingConstraintsPresentation = z.infer<typeof TrainingConstraintsSchema>;

// DOMAIN to PRESENTATION (Schema)
export function toTrainingConstraintsSchema(
  constraints: TrainingConstraints
): TrainingConstraintsPresentation {
  return {
    injuries: constraints.injuries?.map(injury => ({
      bodyPart: injury.bodyPart,
      severity: injury.severity,
      avoidExercises: [...injury.avoidExercises],
      notes: injury.notes,
      reportedDate: injury.reportedDate,
    })),
    availableDays: [...constraints.availableDays],
    preferredTime: constraints.preferredTime,
    maxDuration: constraints.maxDuration,
    availableEquipment: [...constraints.availableEquipment],
    location: constraints.location,
  };
}

// PRESENTATION (Schema) to DOMAIN
export function fromTrainingConstraintsSchema(
  schema: TrainingConstraintsPresentation
): TrainingConstraints {
  return {
    injuries: schema.injuries?.map(injury => ({
      bodyPart: injury.bodyPart,
      severity: injury.severity,
      avoidExercises: [...injury.avoidExercises],
      notes: injury.notes,
      reportedDate: injury.reportedDate,
    })),
    availableDays: [...schema.availableDays],
    preferredTime: schema.preferredTime,
    maxDuration: schema.maxDuration,
    availableEquipment: [...schema.availableEquipment],
    location: schema.location,
  };
}
