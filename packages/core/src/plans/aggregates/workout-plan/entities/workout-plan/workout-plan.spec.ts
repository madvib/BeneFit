import { createPlanGoals } from '../../../../value-objects/plan-goals/plan-goals.js';
import { createProgressionStrategy } from '../../../../value-objects/progression-strategy/progression-strategy.js';
import { createTrainingConstraints } from '../../../../value-objects/training-constraints/training-constraints.js';
import { createDraftWorkoutPlan } from './workout-plan.factory.js';

describe('WorkoutPlan Aggregate Root', () => {
  const validGoalsResult = createPlanGoals({
    primary: 'Run 5k',
    secondary: [],
    targetMetrics: {},
  });
  
  const validProgressionResult = createProgressionStrategy({
    type: 'linear',
  });
  
  const validConstraintsResult = createTrainingConstraints({
    availableDays: ['Monday'],
    availableEquipment: [],
    location: 'outdoor',
  });

  // Check that all creation results are successful before using values
  expect(validGoalsResult.isSuccess).toBe(true);
  expect(validProgressionResult.isSuccess).toBe(true);
  expect(validConstraintsResult.isSuccess).toBe(true);
  
  const validGoals = validGoalsResult.value;
  const validProgression = validProgressionResult.value;
  const validConstraints = validConstraintsResult.value;

  const validProps = {
    id: 'plan-123',
    userId: 'user-123',
    title: 'My Plan',
    description: 'A test plan',
    planType: 'event_training' as const,
    goals: validGoals,
    progression: validProgression,
    constraints: validConstraints,
    startDate: new Date().toISOString(),
  };
  
  it('should create a valid plan', () => {
    const result = createDraftWorkoutPlan(validProps);
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const plan = result.value;
      expect(plan.title).toBe('My Plan');
      expect(plan.status).toBe('draft');
    }
  });

  it('should fail if title is empty', () => {
    const result = createDraftWorkoutPlan({
      id: 'plan-123',
      userId: 'user-123',
      title: '',
      description: 'A test plan',
      planType: 'event_training' as const,
      goals: validGoals,
      progression: validProgression,
      constraints: validConstraints,
      startDate: new Date().toISOString(),
    });
    expect(result.isFailure).toBe(true);
  });
});
