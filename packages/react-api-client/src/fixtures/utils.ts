import { faker } from '@faker-js/faker';

/**
 * Options for fixture builders
 */
export interface FixtureOptions {
  /** Seed for deterministic fixture generation */
  seed?: number;
}

/**
 * Helper to apply seed if provided
 * Reduces repetition across fixture files
 */
export function withSeed<TArgs extends unknown[], TReturn>(
  builder: (...args: TArgs) => TReturn,
  options?: FixtureOptions
): (...args: TArgs) => TReturn {
  return (...args: TArgs) => {
    if (options?.seed !== undefined) {
      faker.seed(options.seed);
    }
    return builder(...args);
  };
}
