import { Result } from '@bene/shared-domain';
import { ProgressionStrategy } from './progression-strategy.types.js';

export interface ProgressionStrategyProps {
  readonly type: ProgressionType;
  readonly weeklyIncrease?: number; // Percentage (0.1 = 10%)
  readonly deloadWeeks?: readonly number[]; // Week numbers to reduce load
  readonly maxIncrease?: number; // Cap on absolute increase per week
  readonly minIncrease?: number; // Minimum increase to be considered progression
  readonly testWeeks?: readonly number[]; // Weeks to assess progress
}

export type ProgressionType = 'linear' | 'undulating' | 'adaptive';

export function createProgressionStrategy(
  props: ProgressionStrategyProps,
): Result<ProgressionStrategy> {
  // Validate weekly increase
  if (props.weeklyIncrease !== undefined) {
    if (props.weeklyIncrease < 0 || props.weeklyIncrease > 1) {
      return Result.fail(new Error('Weekly increase must be between 0 and 1 (0-100%)'));
    }
  }

  // Validate max increase
  if (props.maxIncrease !== undefined && props.maxIncrease < 0) {
    return Result.fail(new Error('Max increase cannot be negative'));
  }

  // Validate min increase
  if (props.minIncrease !== undefined && props.minIncrease < 0) {
    return Result.fail(new Error('Min increase cannot be negative'));
  }

  // Validate deload weeks
  if (props.deloadWeeks) {
    for (const week of props.deloadWeeks) {
      if (week < 1) {
        return Result.fail(new Error('Deload week numbers must be >= 1'));
      }
    }
  }

  // Validate test weeks
  if (props.testWeeks) {
    for (const week of props.testWeeks) {
      if (week < 1) {
        return Result.fail(new Error('Test week numbers must be >= 1'));
      }
    }
  }

  return Result.ok(props);
}

// Factory methods for common progression strategies
export function createLinearProgression(
  weeklyIncrease: number,
  deloadFrequency: number = 4,
): Result<ProgressionStrategy> {
  // Generate deload weeks at the specified frequency
  const deloadWeeks = Array.from({ length: 20 }, (_, i) => (i + 1) * deloadFrequency); // Plan for 20 weeks

  return createProgressionStrategy({
    type: 'linear',
    weeklyIncrease,
    deloadWeeks,
    minIncrease: 0.025,
  });
}

export function createUndulatingProgression(
  weeklyIncrease: number,
): Result<ProgressionStrategy> {
  // Undulating = varies weekly to prevent adaptation
  return createProgressionStrategy({
    type: 'undulating',
    weeklyIncrease,
    testWeeks: [2, 4, 6, 8, 10, 12], // Test every 2 weeks initially
  });
}

export function createAdaptiveProgression(
  weeklyIncrease: number,
  minIncrease: number = 0.02,
  maxIncrease: number = 0.08,
): Result<ProgressionStrategy> {
  return createProgressionStrategy({
    type: 'adaptive',
    weeklyIncrease,
    minIncrease,
    maxIncrease,
    testWeeks: [3, 6, 9, 12, 15, 18], // Test every 3 weeks
  });
}

export function createConservativeProgression(): Result<ProgressionStrategy> {
  return createLinearProgression(0.025, 6); // 2.5% weekly, deload every 6 weeks
}

export function createAggressiveProgression(): Result<ProgressionStrategy> {
  return createLinearProgression(0.075, 3); // 7.5% weekly, deload every 3 weeks
}
