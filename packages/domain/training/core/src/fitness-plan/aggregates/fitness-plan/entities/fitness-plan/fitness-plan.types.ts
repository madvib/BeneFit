import { z } from 'zod';
import { DomainBrandTag } from '@bene/shared';
import { TrainingConstraintsSchema } from '@/shared/index.js';
import {
  PlanGoalsSchema,
  ProgressionStrategySchema,
  PlanPositionSchema,
  WorkoutPreviewSchema,
} from '@/fitness-plan/value-objects/index.js';
import { WeeklyScheduleSchema } from '../weekly-schedule/index.js';

export const PlanPreviewSchema = z.object({
  weekNumber: z.number(),
  workouts: z.array(WorkoutPreviewSchema),
});
export type PlanPreview = z.infer<typeof PlanPreviewSchema>;

// TODO move to shared
export const PlanTypeSchema = z.enum([
  'event_training',
  'habit_building',
  'strength_program',
  'general_fitness',
]);
export type PlanType = z.infer<typeof PlanTypeSchema>;

export const PlanStatusSchema = z.enum(['draft', 'active', 'paused', 'completed', 'abandoned']);
export type PlanStatus = z.infer<typeof PlanStatusSchema>;

export const FitnessPlanSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    planType: PlanTypeSchema,
    templateId: z.uuid().optional(),

    // Use composed schemas
    goals: PlanGoalsSchema,
    progression: ProgressionStrategySchema,
    constraints: TrainingConstraintsSchema,

    weeks: z.array(WeeklyScheduleSchema),

    status: PlanStatusSchema,
    currentPosition: PlanPositionSchema,

    // Dates used z.coerce to gracefully handle ISO strings from boundary
    startDate: z.coerce.date<Date>(),
    endDate: z.coerce.date<Date>().optional(),
    createdAt: z.coerce.date<Date>(),
    updatedAt: z.coerce.date<Date>(),
  })
  .brand<DomainBrandTag>();

export type FitnessPlan = Readonly<z.infer<typeof FitnessPlanSchema>>;
