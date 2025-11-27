export type ProgressionType = 'linear' | 'undulating' | 'adaptive';

export interface ProgressionStrategy {
  readonly type: ProgressionType;
  readonly weeklyIncrease?: number; // Percentage (0.1 = 10%)
  readonly deloadWeeks?: readonly number[]; // Week numbers to reduce load
  readonly maxIncrease?: number; // Cap on absolute increase per week
  readonly minIncrease?: number; // Minimum increase to be considered progression
  readonly testWeeks?: readonly number[]; // Weeks to assess progress
}