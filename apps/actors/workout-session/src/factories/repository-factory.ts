import { WorkoutSessionRepository } from '@bene/training-application';
import { DurableWorkoutSessionRepository } from '../repositories/durable-workout-session.repository';
import { createDOClient, DOClient } from '@bene/persistence';

/**
 * A factory responsible for instantiating all concrete Repository implementations.
 */
export class RepositoryFactory {
  private _workoutSessionRepo?: WorkoutSessionRepository;
  private db: DOClient<unknown>;

  constructor(storage: DurableObjectStorage) {
    this.db = createDOClient(storage);
  }

  // --- Public Getters (Lazy-Loaded) ---

  public getWorkoutSessionRepository(): WorkoutSessionRepository {
    if (!this._workoutSessionRepo) {
      this._workoutSessionRepo = new DurableWorkoutSessionRepository(this.db); // Placeholder
    }
    return this._workoutSessionRepo;
  }
}
