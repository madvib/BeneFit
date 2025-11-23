export * from './entities/Workout.js';
export * from './entities/Plan.js';
export * from '../connections/entities/ServiceConnection.js';
export type ActivityType =
  | 'workout'
  | 'nutrition'
  | 'goal'
  | 'achievement'
  | 'progress'
  | 'default';
