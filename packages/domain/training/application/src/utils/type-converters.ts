/**
 * Type conversion utilities for mapping between Zod schema types and domain types
 */
import { z } from 'zod';
import {
  FitnessGoals,
  TrainingConstraints,
  ExperienceProfile,
  PlanGoals,
} from '@bene/training-core';
import {
  FitnessGoalsSchema,
  TrainingConstraintsSchema,
  ExperienceProfileSchema,
  PlanGoalsSchema,
} from '../schemas/index.js';

// Convert Zod inferred FitnessGoals to domain FitnessGoals (handles date strings → Date)
export function toDomainFitnessGoals(fitnessGoals: z.infer<typeof FitnessGoalsSchema>): FitnessGoals {
  return {
    ...fitnessGoals,
    targetDate: fitnessGoals.targetDate ? new Date(fitnessGoals.targetDate) : undefined,
  };
}

// Convert Zod inferred TrainingConstraints to domain TrainingConstraints
export function toDomainTrainingConstraints(constraints: z.infer<typeof TrainingConstraintsSchema>): TrainingConstraints {
  return constraints; // No date conversions needed
}

// Convert Zod inferred ExperienceProfile to domain ExperienceProfile
export function toDomainExperienceProfile(experience: z.infer<typeof ExperienceProfileSchema>): ExperienceProfile {
  return {
    ...experience,
    lastAssessmentDate: new Date(experience.lastAssessmentDate),
  };
}

// Convert Zod inferred PlanGoals to domain PlanGoals
export function toDomainPlanGoals(goals: z.infer<typeof PlanGoalsSchema>): PlanGoals {
  return {
    ...goals,
    targetDate: goals.targetDate ? new Date(goals.targetDate) : undefined,
  };
}