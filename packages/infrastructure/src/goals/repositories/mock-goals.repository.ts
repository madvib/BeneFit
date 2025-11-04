import { GoalsRepository } from '@bene/application/goals';
import { Goal } from '@bene/core/goals';
import { Result } from '@bene/core/shared';

// Define a type that matches the original DTO format for JSON data
interface RawGoal {
  id: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
}

export class MockGoalsRepository implements GoalsRepository {
  async findById(id: string): Promise<Result<Goal>> {
    const rawGoals = await this.loadRawGoals();
    const rawGoal = rawGoals.find((goal) => goal.id.toString() === id);

    if (!rawGoal) {
      return Result.fail(new Error('Goal not found'));
    }

    // Convert raw data to entity
    const entityResult = Goal.create({
      ...rawGoal,
      id: rawGoal.id.toString(),
      isActive: false,
    });

    return entityResult;
  }

  async save(entity: Goal): Promise<Result<void>> {
    console.log(`${entity} saved`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    console.log(`${id} deleted`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  private async loadRawGoals(): Promise<RawGoal[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/goals.json');
    return data.default as RawGoal[];
  }

  async getGoals(): Promise<Goal[]> {
    const rawGoals = await this.loadRawGoals();
    const goals: Goal[] = [];

    for (const rawGoal of rawGoals) {
      const entityResult = Goal.create({
        ...rawGoal,
        id: rawGoal.id.toString(),
        isActive: false,
      });

      if (entityResult.isSuccess) {
        goals.push(entityResult.value);
      }
    }

    return goals;
  }

  async getCurrentGoal(): Promise<Goal | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/currentGoal.json');
    const rawGoal = data.default as RawGoal;

    if (rawGoal) {
      const entityResult = Goal.create({
        ...rawGoal,
        id: rawGoal.id.toString(),
        isActive: false,
      });

      if (entityResult.isSuccess) {
        return entityResult.value;
      }
    }

    return null;
  }

  async updateGoal(goal: Goal): Promise<Goal> {
    // In a mock implementation, just return the goal as if it was updated
    return goal;
  }
}
