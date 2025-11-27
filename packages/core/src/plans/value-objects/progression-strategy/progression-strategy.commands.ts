import { ProgressionStrategy } from './progression-strategy.types.js';

// Type checks
export function isLinear(strategy: ProgressionStrategy): boolean {
  return strategy.type === 'linear';
}

export function isUndulating(strategy: ProgressionStrategy): boolean {
  return strategy.type === 'undulating';
}

export function isAdaptive(strategy: ProgressionStrategy): boolean {
  return strategy.type === 'adaptive';
}

export function isConservative(strategy: ProgressionStrategy): boolean {
  return strategy.weeklyIncrease !== undefined && strategy.weeklyIncrease <= 0.03;
}

// Progression calculations
export function calculateNextWeekLoad(strategy: ProgressionStrategy, currentLoad: number, currentWeek: number): number {
  // Check if this is a deload week
  if (strategy.deloadWeeks && strategy.deloadWeeks.includes(currentWeek)) {
    return currentLoad * 0.85; // 15% reduction on deload weeks
  }

  // Base progression
  const weeklyIncrease = strategy.weeklyIncrease || 0.025; // Default 2.5%
  const increase = currentLoad * weeklyIncrease;

  // Apply max increase cap if defined
  if (strategy.maxIncrease) {
    const cappedIncrease = Math.min(increase, strategy.maxIncrease);
    return currentLoad + cappedIncrease;
  }

  return currentLoad + increase;
}

export function calculateAdaptiveLoad(strategy: ProgressionStrategy, currentLoad: number, currentWeek: number, performanceScore: number): number {
  // Performance score: 0 (poor) to 1 (excellent)
  if (!isAdaptive(strategy)) {
    return calculateNextWeekLoad(strategy, currentLoad, currentWeek);
  }

  // Adjust progression based on performance
  const baseIncrease = strategy.weeklyIncrease || 0.03;
  const performanceFactor = 0.5 + (performanceScore * 0.5); // 0.5 to 1.0 based on performance
  const adjustedIncrease = baseIncrease * performanceFactor;

  // Calculate new load
  let newLoad = currentLoad + (currentLoad * adjustedIncrease);

  // Ensure it stays within bounds
  if (strategy.minIncrease !== undefined) {
    const minLoad = currentLoad + (currentLoad * strategy.minIncrease);
    newLoad = Math.max(newLoad, minLoad);
  }

  if (strategy.maxIncrease !== undefined) {
    const maxLoad = currentLoad + strategy.maxIncrease;
    newLoad = Math.min(newLoad, maxLoad);
  }

  return newLoad;
}

export function calculateNextWeekWeight(strategy: ProgressionStrategy, currentWeight: number, currentWeek: number, minIncrement: number = 2.5): number {
  const nextLoad = calculateNextWeekLoad(strategy, currentWeight, currentWeek);

  // Round to nearest increment
  return Math.round(nextLoad / minIncrement) * minIncrement;
}

export function calculateNextWeekVolume(strategy: ProgressionStrategy, currentVolume: number, currentWeek: number): number {
  if (strategy.deloadWeeks && strategy.deloadWeeks.includes(currentWeek)) {
    return currentVolume * 0.75; // 25% reduction on deload weeks
  }

  const weeklyIncrease = strategy.weeklyIncrease || 0.03;
  return currentVolume * (1 + weeklyIncrease);
}

export function calculateNextWeekDistance(strategy: ProgressionStrategy, currentDistance: number, currentWeek: number): number {
  if (strategy.deloadWeeks && strategy.deloadWeeks.includes(currentWeek)) {
    return currentDistance * 0.9; // 10% reduction on deload weeks
  }

  const weeklyIncrease = strategy.weeklyIncrease || 0.05;
  return Math.round(currentDistance * (1 + weeklyIncrease));
}

export function calculateNextWeekPace(strategy: ProgressionStrategy, currentPace: number, currentWeek: number, improvementRate?: number): number {
  // For pace, smaller numbers are better (faster pace)
  // So we need to reduce the time to improve
  const rate = improvementRate ?? (strategy.weeklyIncrease || 0.01); // Default 1% improvement
  
  if (strategy.deloadWeeks && strategy.deloadWeeks.includes(currentWeek)) {
    // During deload, might maintain or slightly slower pace for recovery
    return currentPace * 1.02; // Slightly slower pace during deload
  }

  return Math.max(100, Math.round(currentPace * (1 - rate))); // Ensure minimum pace
}

// Deload week logic
export function isDeloadWeek(strategy: ProgressionStrategy, week: number): boolean {
  return strategy.deloadWeeks ? strategy.deloadWeeks.includes(week) : false;
}

export function getNextDeloadWeek(strategy: ProgressionStrategy, fromWeek: number): number | null {
  if (!strategy.deloadWeeks) {
    return null;
  }

  for (const week of strategy.deloadWeeks) {
    if (week > fromWeek) {
      return week;
    }
  }

  return null;
}

export function weeksUntilDeload(strategy: ProgressionStrategy, fromWeek: number): number | null {
  const nextDeload = getNextDeloadWeek(strategy, fromWeek);
  return nextDeload ? nextDeload - fromWeek : null;
}

// Test week logic
export function isTestWeek(strategy: ProgressionStrategy, week: number): boolean {
  return strategy.testWeeks ? strategy.testWeeks.includes(week) : false;
}

export function getNextTestWeek(strategy: ProgressionStrategy, fromWeek: number): number | null {
  if (!strategy.testWeeks) {
    return null;
  }

  for (const week of strategy.testWeeks) {
    if (week > fromWeek) {
      return week;
    }
  }

  return null;
}

// Strategy transformations
export function convertToConservative(strategy: ProgressionStrategy): ProgressionStrategy {
  return {
    ...strategy,
    weeklyIncrease: 0.02, // Conservative 2% weekly increase
    deloadFrequency: 6, // Deload every 6 weeks
  };
}

export function convertToAggressive(strategy: ProgressionStrategy): ProgressionStrategy {
  return {
    ...strategy,
    weeklyIncrease: 0.08, // Aggressive 8% weekly increase
    deloadFrequency: 3, // Deload every 3 weeks
  };
}

// Description helpers
export function getDescription(strategy: ProgressionStrategy): string {
  const parts: string[] = [strategy.type];

  if (strategy.weeklyIncrease !== undefined) {
    parts.push(`${Math.round(strategy.weeklyIncrease * 100)}% weekly`);
  }

  if (strategy.deloadWeeks) {
    parts.push(`${strategy.deloadWeeks.length} deloads`);
  }

  return parts.join(' - ');
}

// Equality
export function equals(strategy: ProgressionStrategy, other: ProgressionStrategy): boolean {
  if (!other) return false;

  return (
    strategy.type === other.type &&
    strategy.weeklyIncrease === other.weeklyIncrease &&
    strategy.maxIncrease === other.maxIncrease &&
    strategy.minIncrease === other.minIncrease &&
    JSON.stringify(strategy.deloadWeeks) === JSON.stringify(other.deloadWeeks) &&
    JSON.stringify(strategy.testWeeks) === JSON.stringify(other.testWeeks)
  );
}