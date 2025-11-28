import { Result } from '@bene/core/shared';
import { CoachingContext } from '@bene/core/coach';

export interface CoachingContextBuilder {
  buildContext(userId: string): Promise<Result<CoachingContext>>;
}