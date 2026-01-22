import { Result } from '../core/base-classes/result/result.js';

/**
 * Base options for all UseCase fixtures
 */
export interface BaseFixtureOptions<T> {
  overrides?: Partial<T>;
  success?: boolean;
  temperature?: number; // 0 to 1, probability of returning a failure result
}

/**
 * Common failure types for fixtures
 */
export type FixtureFailureType = 'network' | 'validation' | 'not-found' | 'conflict' | 'unauthorized';

/**
 * Utility to handle common fixture options: fuzzing (temperature) and deterministic success/failure.
 * 
 * @param options The fixture options
 * @param defaultFailureMessage Message to use for failure
 * @returns A Result if a failure was triggered, otherwise undefined to continue success path
 */
export function handleFixtureOptions<T>(
  options: BaseFixtureOptions<T>,
  defaultFailureMessage: string = 'Simulated fixture failure'
): Result<T> | undefined {
  const { success, temperature = 0 } = options;

  // 1. Fuzzing: probabilistic failure
  if (temperature > 0 && Math.random() < temperature) {
    return Result.fail(new Error(`[Fuzzed] ${ defaultFailureMessage }`));
  }

  // 2. Deterministic failure
  if (success === false) {
    return Result.fail(new Error(defaultFailureMessage));
  }

  return undefined;
}
