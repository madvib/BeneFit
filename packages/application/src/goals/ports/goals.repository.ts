import { Repository } from '@bene/core/shared';
import { Goal } from '@bene/core/goals';

export interface GoalsRepository extends Repository<Goal> {
  getGoals(): Promise<Goal[]>;
  getCurrentGoal(): Promise<Goal | null>;
  updateGoal(goal: Goal): Promise<Goal>;
}
