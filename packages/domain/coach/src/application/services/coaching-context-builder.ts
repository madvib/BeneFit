import { Result } from '@bene/shared-domain';
import { CoachingContext } from '@core/index.js';

export interface CoachingContextBuilder {
  buildContext(userId: string): Promise<Result<CoachingContext>>;
}
