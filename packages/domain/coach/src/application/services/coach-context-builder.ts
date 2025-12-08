import { Result } from '@bene/shared-domain';
import { CoachContext } from '@core/index.js';

export interface CoachContextBuilder {
  buildContext(userId: string): Promise<Result<CoachContext>>;
}
