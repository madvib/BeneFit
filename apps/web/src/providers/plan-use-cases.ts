import { MockPlanRepository } from '@bene/infrastructure/activities';
import { MockWorkoutRepository } from '@bene/infrastructure/activities';
import { GetPlanDataUseCase } from '@bene/application/activities';

// Create repository instances
const planRepository = new MockPlanRepository();
const workoutRepository = new MockWorkoutRepository();

// Instantiate plan use cases as constants
export const getPlanDataUseCase = new GetPlanDataUseCase(planRepository, workoutRepository);

// Export all plan-related use cases
export const planUseCases = {
  getPlanDataUseCase,
};