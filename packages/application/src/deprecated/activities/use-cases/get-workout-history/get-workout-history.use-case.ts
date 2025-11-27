import { Result, UseCase } from '@bene/core/shared';
import { WorkoutRepository } from '../../ports/repository/activities.repository.js';
import { WorkoutHistoryFetchError } from '../../errors/index.js';

export type GetWorkoutHistoryOutput = Awaited<
  ReturnType<WorkoutRepository['getWorkoutHistory']>
>;

export class GetWorkoutHistoryUseCase
  implements UseCase<void, GetWorkoutHistoryOutput>
{
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(): Promise<Result<GetWorkoutHistoryOutput>> {
    try {
      const workouts = await this.workoutRepository.getWorkoutHistory();
      return Result.ok(workouts);
    } catch (e) {
      //TODO repo should return result
      console.log(e);
      return Result.fail(new WorkoutHistoryFetchError());
    }
  }
}
