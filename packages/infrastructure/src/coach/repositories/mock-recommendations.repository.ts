import { Result } from '@bene/core/shared';
import { Recommendation } from '@bene/core/coach';
import { RecommendationsRepository } from '@bene/application/coach';

// Define interface for JSON data import
interface RecommendationData {
  id: number;
  title: string;
  description: string;
  category: string;
}

export class MockRecommendationsRepository implements RecommendationsRepository {
  async findById(id: string): Promise<Result<Recommendation>> {
    // Load recommendations from mock data
    const data = await import('../data/mock/recommendations.json');
    const recommendations: RecommendationData[] = data.default;
    const recData = recommendations.find((r) => r.id.toString() === id);

    if (!recData) {
      return Result.fail(new Error('Recommendation not found'));
    }

    const recommendationOrError = Recommendation.create({
      id: recData.id.toString(),
      title: recData.title,
      description: recData.description,
      category: recData.category,
      createdAt: new Date(),
    });

    if (recommendationOrError.isFailure) {
      return Result.fail(recommendationOrError.error);
    }

    return recommendationOrError;
  }

  async save(entity: Recommendation): Promise<Result<void>> {
    console.log(`${entity} saved`);
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    console.log(`${id} deleted`);
    return Result.ok();
  }

  async getRecommendationsForUser(userId: string): Promise<Recommendation[]> {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    const data = await import('../data/mock/recommendations.json');
    const recommendations: RecommendationData[] = data.default;

    const recommendationEntities: Recommendation[] = [];
    for (const rec of recommendations) {
      const recommendationOrError = Recommendation.create({
        id: rec.id.toString(),
        title: rec.title,
        description: rec.description,
        category: rec.category,
        createdAt: new Date(),
      });

      if (recommendationOrError.isSuccess) {
        recommendationEntities.push(recommendationOrError.value);
      } else {
        console.error(
          'Failed to create Recommendation entity:',
          recommendationOrError.error,
        );
      }
    }

    return recommendationEntities;
  }

  async getPersonalizedRecommendations(
    userId: string,
    context?: any,
  ): Promise<Recommendation[]> {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    const data = await import('../data/mock/recommendations.json');
    const recommendations: RecommendationData[] = data.default;

    // In a real implementation, this would filter based on user context
    // For now, return all recommendations
    const recommendationEntities: Recommendation[] = [];
    for (const rec of recommendations) {
      const recommendationOrError = Recommendation.create(
        {
          id: rec.id.toString(),
          title: rec.title,
          description: rec.description,
          category: rec.category,
          createdAt: new Date(),
        },
        rec.id.toString(),
      );

      if (recommendationOrError.isSuccess) {
        recommendationEntities.push(recommendationOrError.value);
      } else {
        console.error(
          'Failed to create Recommendation entity:',
          recommendationOrError.error,
        );
      }
    }

    return recommendationEntities;
  }
}
