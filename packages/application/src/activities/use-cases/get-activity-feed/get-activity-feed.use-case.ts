import { Result, UseCase } from '@bene/core/shared';
import { ActivityFeedFetchError } from '../../errors/index.js';
import { WorkoutRepository } from '../../ports/repository/activities.repository.js';

export type GetActivityFeedOutput = Awaited<
  ReturnType<WorkoutRepository['getActivityFeed']>
>;

export class GetActivityFeedUseCase implements UseCase<void, GetActivityFeedOutput> {
  constructor(private activityRepository: WorkoutRepository) {}

  async execute(): Promise<Result<GetActivityFeedOutput>> {
    try {
      const activityFeed = await this.activityRepository.getActivityFeed();
      return Result.ok(activityFeed);
    } catch (e) {
      console.log(e);
      return Result.fail(new ActivityFeedFetchError());
    }
  }
}
