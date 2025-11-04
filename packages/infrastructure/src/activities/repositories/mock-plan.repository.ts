import { PlanRepository } from '@bene/application/activities';
import { Plan } from '@bene/core/activities';
import { Result } from '@bene/core/shared';

// Mock repository for Plan domain entity
export class MockPlanRepository implements PlanRepository {
  async findById(id: string): Promise<Result<Plan>> {
    // For mock implementation, we'll create a mock plan
    const entityResult = Plan.create({
      id,
      name: 'Mock Plan',
      description: 'A mock plan for testing',
      duration: '4 weeks',
      difficulty: 'Intermediate',
      category: 'Strength',
      progress: 0,
      isActive: true,
    });

    if (entityResult.isSuccess) {
      return Result.ok(entityResult.value);
    } else {
      return Result.fail(entityResult.error);
    }
  }

  async save(entity: Plan): Promise<Result<void>> {
    // In a mock implementation, we just return success
    console.log(`${entity} saved`);
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    // In a mock implementation, we just return success
    console.log(`${id} deleted`);
    return Result.ok();
  }

  async getCurrentPlan(): Promise<Plan | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/planData.json');

    const entityResult = Plan.create({
      id: data.default.currentPlan.id.toString(),
      name: data.default.currentPlan.name,
      description: data.default.currentPlan.description,
      duration: data.default.currentPlan.duration,
      difficulty: data.default.currentPlan.difficulty as
        | 'Intermediate'
        | 'Beginner'
        | 'Advanced',
      category: data.default.currentPlan.category,
      progress: data.default.currentPlan.progress,
      isActive: true,
    });

    if (entityResult.isSuccess) {
      return entityResult.value;
    } else {
      return null;
    }
  }

  async getPlanSuggestions(): Promise<Plan[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/planData.json');

    const plans: Plan[] = [];
    for (const dto of data.default.planSuggestions) {
      const entityResult = Plan.create({
        id: dto.id.toString(),
        name: dto.name,
        description: 'Suggested plan',
        duration: dto.duration,
        difficulty: dto.difficulty as 'Intermediate' | 'Beginner' | 'Advanced',
        category: dto.category,
        progress: 0,
        isActive: false,
      });

      if (entityResult.isSuccess) {
        plans.push(entityResult.value);
      }
    }

    return plans;
  }
}
