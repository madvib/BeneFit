import { Result } from '@bene/shared-domain';
import { FitnessPlan } from '@bene/training-core';
import { PlanGoals, TrainingConstraints } from '@bene/training-core';

export interface GeneratePlanInput {
  goals: PlanGoals;
  constraints: TrainingConstraints;
  experienceLevel: string;
  customInstructions?: string;
}

export interface AdjustPlanInput {
  currentPlan: FitnessPlan;
  feedback: string;
  recentPerformance: Array<{
    perceivedExertion: number;
    enjoyment: number;
    difficultyRating: string;
  }>;
}

export interface AIPlanGenerator {
  generatePlan(input: GeneratePlanInput): Promise<Result<FitnessPlan>>;
  adjustPlan(input: AdjustPlanInput): Promise<Result<FitnessPlan>>;
}
