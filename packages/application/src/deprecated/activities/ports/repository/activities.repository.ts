import { Repository } from '@bene/core/shared';
import { Workout } from '@bene/core/activities';

// Repository for Workout domain entity
export interface WorkoutRepository extends Repository<Workout> {
  getWorkoutHistory(): Promise<Workout[]>;
  getActivityFeed(): Promise<Workout[]>;
}
