import { z } from 'zod';
import { FITNESS_GOALS, SECONDARY_GOALS, EQUIPMENT_OPTIONS } from '@bene/shared';

// Define the goals schema for plan generation
const PlanGoalsSchema = z.object({
  primary: z.enum(FITNESS_GOALS),
  secondary: z.array(z.enum(SECONDARY_GOALS)),
  targetMetrics: z.object({
    totalWorkouts: z.number().min(1).max(500), // Total planned workouts
  }),
});

export type PlanGoals = z.infer<typeof PlanGoalsSchema>;

// Define the equipment schema
const PlanEquipmentSchema = z.object({
  availableEquipment: z.array(z.enum(EQUIPMENT_OPTIONS)).default([]),
});

export type PlanEquipment = z.infer<typeof PlanEquipmentSchema>;

// Define the generation form schema (more appropriate naming than 'Request')
export const GeneratePlanFormSchema = z.object({
  goals: PlanGoalsSchema,
  availableEquipment: z.array(z.enum(EQUIPMENT_OPTIONS)).default([]),
  customInstructions: z.string().max(1000).optional(),
});

export type GeneratePlanFormValues = z.infer<typeof GeneratePlanFormSchema>;

// Test schema that matches API requirements
export const GeneratePlanApiSchema = GeneratePlanFormSchema;
export type GeneratePlanApiPayload = z.infer<typeof GeneratePlanApiSchema>;