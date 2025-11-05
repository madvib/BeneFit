import { UseCase } from '@bene/core/shared';
import { GoalsRepository } from '../../ports/goals.repository.js';
import { Goal } from '@bene/core/goals';
import { Result } from '@bene/core/shared';
import { GoalsFetchError } from '../../errors/index.js';

export type GetGoalsInput = void;
export type GetGoalsOutput = Goal[];

export class GetGoalsUseCase implements UseCase<GetGoalsInput, GetGoalsOutput> {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute(): Promise<Result<GetGoalsOutput>> {
    try {
      const goals = await this.goalsRepository.getGoals();
      return Result.ok(goals);
    } catch (error) {
      console.error('Error in GetGoalsUseCase:', error);
      return Result.fail(new GoalsFetchError());
    }
  }
}
