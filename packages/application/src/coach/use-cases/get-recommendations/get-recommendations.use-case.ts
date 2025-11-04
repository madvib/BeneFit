import { UseCase } from '@bene/core/shared';
import { RecommendationsRepository } from '../../ports/recommendations.repository.js';
import { Recommendation } from '@bene/core/coach';
import { Result } from '@bene/core/shared';
import { RecommendationsFetchError } from '../../errors/index.js';

export interface GetRecommendationsInput {
  userId: string;
  context?: any;
}
export type GetRecommendationsOutput = Recommendation[];

export class GetRecommendationsUseCase
  implements UseCase<GetRecommendationsInput, GetRecommendationsOutput>
{
  constructor(private recommendationsRepository: RecommendationsRepository) {}

  async execute(
    input: GetRecommendationsInput,
  ): Promise<Result<GetRecommendationsOutput>> {
    try {
      const recommendations =
        await this.recommendationsRepository.getPersonalizedRecommendations(
          input.userId,
          input.context,
        );
      console.log(recommendations);
      return Result.ok(recommendations);
    } catch (error) {
      console.error('Error in GetRecommendationsUseCase:', error);
      return Result.fail(new RecommendationsFetchError());
    }
  }
}
