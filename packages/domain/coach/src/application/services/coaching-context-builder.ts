import { Result } from '@bene/domain-shared';
import { CoachingContext } from '@core/index.js';

export interface CoachingContextBuilder {
  buildContext(userId: string): Promise<Result<CoachingContext>>;
}
