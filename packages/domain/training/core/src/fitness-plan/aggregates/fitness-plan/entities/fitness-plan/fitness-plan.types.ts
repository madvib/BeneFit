import { z } from 'zod';
import { DomainBrandTag, PLAN_STATUSES, PLAN_TYPES } from '@bene/shared';
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

export const PlanStatusSchema = z.enum(PLAN_STATUSES);

export const PlanTypeSchema = z.enum(PLAN_TYPES);
export type PlanType = z.infer<typeof PlanTypeSchema>;
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

    startDate: z.coerce.date<Date>(),
    endDate: z.coerce.date<Date>().optional(),
    createdAt: z.coerce.date<Date>(),
    updatedAt: z.coerce.date<Date>(),
  })
  .brand<DomainBrandTag>();

export type FitnessPlan = Readonly<z.infer<typeof FitnessPlanSchema>>;
