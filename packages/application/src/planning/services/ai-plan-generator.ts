import { Result } from '@bene/core/shared';
import { WorkoutPlan } from '@bene/core/plans';
import { PlanGoals, TrainingConstraints } from '@bene/core/plans';

export interface GeneratePlanInput {
  goals: PlanGoals;
  constraints: TrainingConstraints;
  experienceLevel: string;
  customInstructions?: string;
}

export interface AdjustPlanInput {
  currentPlan: WorkoutPlan;
  feedback: string;
  recentPerformance: Array<{
    perceivedExertion: number;
    enjoyment: number;
    difficultyRating: string;
  }>;
}

export interface AIPlanGenerator {
  generatePlan(input: GeneratePlanInput): Promise<Result<WorkoutPlan>>;
  adjustPlan(input: AdjustPlanInput): Promise<Result<WorkoutPlan>>;
}
