import { FitnessPlan } from '@bene/training-core';
import type { ActiveFitnessPlan, NewActiveFitnessPlan } from '../data/schema';

export function toDomain(row: ActiveFitnessPlan): FitnessPlan {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description || '',
    planType: row.planType as any,
    goals: row.goalsJson as any,
    progression: row.progressionJson as any,
    constraints: row.constraintsJson as any,
    weeks: (row.weeksJson as any) || [],
    status: row.status as any,
    currentPosition: row.currentPositionJson as any,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate?.toISOString(),
    createdAt: row.createdAt || new Date(),
    updatedAt: row.updatedAt || undefined,
  };
}

export function toDatabase(plan: FitnessPlan): NewActiveFitnessPlan {
  return {
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    description: plan.description,
    planType: plan.planType,
    templateId: null, // Domain doesn't seem to have templateId?
    goalsJson: plan.goals,
    progressionJson: plan.progression,
    constraintsJson: plan.constraints,
    currentPositionJson: plan.currentPosition,
    status: plan.status,
    startDate: new Date(plan.startDate),
    endDate: plan.endDate ? new Date(plan.endDate) : null,
    weeksJson: plan.weeks,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}
