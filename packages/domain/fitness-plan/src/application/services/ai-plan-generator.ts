import { Result } from '@bene/domain-shared';
import { WorkoutPlan } from '@core/index.js';
import { PlanGoals, TrainingConstraints } from '@core/index.js';

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
