import { FitnessPlan, FitnessPlanSchema } from '@bene/training-core';
import type { ActiveFitnessPlan, NewActiveFitnessPlan } from '../data/schema';

export function toDomain(row: ActiveFitnessPlan): FitnessPlan {
  const data = {
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description,
    planType: row.planType,
    templateId: row.templateId || undefined,
    goals: {
      ...row.goalsJson,
      targetDate: row.targetDate || undefined,
    },
    progression: row.progressionJson,
    constraints: row.constraintsJson,
    weeks: row.weeksJson,
    status: row.status,
    currentPosition: row.currentPositionJson,
    startDate: row.startDate,
    endDate: row.endDate || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  return FitnessPlanSchema.parse(data);
}

export function toDatabase(plan: FitnessPlan): NewActiveFitnessPlan {
  // Extract targetDate from goals
  const { targetDate, ...goalsData } = plan.goals;

  return {
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    description: plan.description,
    planType: plan.planType,
    templateId: plan.templateId || null,
    targetDate: targetDate || null,
    goalsJson: goalsData,
    progressionJson: plan.progression,
    constraintsJson: plan.constraints,
    currentPositionJson: plan.currentPosition,
    status: plan.status,
    startDate: plan.startDate,
    endDate: plan.endDate || null,
    weeksJson: plan.weeks,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}
