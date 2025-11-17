import { Result } from '@bene/core/shared';

/**
 * Base interface for all use cases
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<Result<TOutput>>;
}
