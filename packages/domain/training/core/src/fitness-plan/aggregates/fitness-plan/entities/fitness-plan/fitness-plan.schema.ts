import { z } from 'zod';
import { TrainingConstraintsSchema } from '@/shared/value-objects/training-constraints/training-constraints.presentation.js';
import {
  PlanGoalsSchema,
  ProgressionStrategySchema,
  PlanPositionSchema,
} from '@/fitness-plan/value-objects/index.js';
import { WeeklyScheduleSchema, toWeeklyScheduleSchema } from '../weekly-schedule/weekly-schedule.schema.js';
import { WorkoutTemplateSchema, toWorkoutTemplateSchema } from '../workout-template/workout-template.schema.js';
import { FitnessPlan } from './fitness-plan.types.js';
import * as Queries from './fitness-plan.queries.js';

export const PlanTypeSchema = z.enum([
  'event_training',
  'habit_building',
  'strength_program',
  'general_fitness'
]);

export const PlanStatusSchema = z.enum(['draft', 'active', 'paused', 'completed', 'abandoned']);

export const FitnessPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  planType: PlanTypeSchema,
  goals: PlanGoalsSchema,
  progression: ProgressionStrategySchema,
  constraints: TrainingConstraintsSchema,
  weeks: z.array(WeeklyScheduleSchema),
  status: PlanStatusSchema,
  currentPosition: PlanPositionSchema,
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().optional(),
  // Computed / Enriched Fields
  currentWorkout: WorkoutTemplateSchema.optional(),
  currentWeek: WeeklyScheduleSchema.optional(),
  summary: z.object({
    total: z.number().int().min(0).max(1000),
    completed: z.number().int().min(0).max(1000),
  }),
});

export type FitnessPlanSchema = z.infer<typeof FitnessPlanSchema>;


export function toFitnessPlanSchema(plan: FitnessPlan): FitnessPlanSchema {
  const currentWorkout = Queries.getCurrentWorkout(plan);
  const currentWeek = Queries.getCurrentWeek(plan);
  const summary = Queries.getWorkoutSummary(plan);

  return {
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    description: plan.description,
    planType: plan.planType,
    goals: {
      ...plan.goals,
      secondary: [...plan.goals.secondary],
      targetMetrics: {
        ...plan.goals.targetMetrics,
        targetWeights: plan.goals.targetMetrics.targetWeights
          ? [...plan.goals.targetMetrics.targetWeights]
          : undefined,
      },
      targetDate: plan.goals.targetDate,
    },
    progression: {
      ...plan.progression,
      deloadWeeks: plan.progression.deloadWeeks ? [...plan.progression.deloadWeeks] : undefined,
      testWeeks: plan.progression.testWeeks ? [...plan.progression.testWeeks] : undefined,
    },
    constraints: {
      ...plan.constraints,
      availableDays: [...plan.constraints.availableDays],
      availableEquipment: [...plan.constraints.availableEquipment],
      injuries: plan.constraints.injuries ? plan.constraints.injuries.map(i => ({
        ...i,
        avoidExercises: [...i.avoidExercises]
      })) : undefined,
    },
    weeks: plan.weeks.map(toWeeklyScheduleSchema),
    status: plan.status,
    currentPosition: plan.currentPosition,
    startDate: plan.startDate.toISOString(),
    endDate: plan.endDate?.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt?.toISOString(),

    // Computed
    currentWorkout: currentWorkout ? toWorkoutTemplateSchema(currentWorkout) : undefined,
    currentWeek: currentWeek ? toWeeklyScheduleSchema(currentWeek) : undefined,
    summary,
  };
}
