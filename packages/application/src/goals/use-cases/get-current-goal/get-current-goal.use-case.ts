import { UseCase } from '@bene/application/shared';
import { GoalsRepository } from '../../ports/goals.repository.js';
import { Goal } from '@bene/core/goals';
import { Result } from '@bene/core/shared';
import { CurrentGoalFetchError } from '../../errors/index.js';

export type GetCurrentGoalInput = void;
export type GetCurrentGoalOutput = Goal | null;

export class GetCurrentGoalUseCase implements UseCase<GetCurrentGoalInput, GetCurrentGoalOutput> {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute(): Promise<Result<GetCurrentGoalOutput>> {
    try {
      const currentGoal = await this.goalsRepository.getCurrentGoal();
      return Result.ok(currentGoal);
    } catch (error) {
      console.error('Error in GetCurrentGoalUseCase:', error);
      return Result.fail(new CurrentGoalFetchError());
    }
  }
}
