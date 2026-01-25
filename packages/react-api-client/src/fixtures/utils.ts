import { faker } from '@faker-js/faker';

/**
 * Options for fixture builders
 */
/**
 * Enhances fixture options with seeding capability
 */
export type WithSeed<T> = T & { seed?: number };

/**
 * Helper to apply seed if provided
 */
export function applySeed(options?: { seed?: number }) {
  if (options?.seed !== undefined) {
    faker.seed(options.seed);
  }
}
