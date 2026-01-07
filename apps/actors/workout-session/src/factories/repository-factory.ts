import { drizzle, type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';

import { WorkoutSessionRepository } from '@bene/training-application';
import { DurableWorkoutSessionRepository } from '../repositories/durable-workout-session.repository';
import { workout_session_schema } from '../data/schema';

/**
 * A factory responsible for instantiating all concrete Repository implementations.
 */
export class RepositoryFactory {
  private _workoutSessionRepo?: WorkoutSessionRepository;
  private db: DrizzleSqliteDODatabase<typeof workout_session_schema>;

  constructor(storage: DurableObjectStorage) {
    this.db = drizzle(storage);
  }

  // --- Public Getters (Lazy-Loaded) ---

  public getWorkoutSessionRepository(): WorkoutSessionRepository {
    if (!this._workoutSessionRepo) {
      this._workoutSessionRepo = new DurableWorkoutSessionRepository(this.db); // Placeholder
    }
    return this._workoutSessionRepo;
  }
}
