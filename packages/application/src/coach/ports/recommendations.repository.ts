import { Repository } from '@bene/core/shared';
import { Recommendation } from '@bene/core/coach';

export interface RecommendationsRepository extends Repository<Recommendation> {
  getRecommendationsForUser(userId: string): Promise<Recommendation[]>;
  getPersonalizedRecommendations(userId: string, context?: any): Promise<Recommendation[]>;
}