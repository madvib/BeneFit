import {
  UserProfileRepository,
  CompletedWorkoutRepository,
  FitnessPlanRepository,
  WorkoutSessionRepository,
} from '@bene/training-application';
import {
  DurableWorkoutSessionRepository,
  DurableUserProfileRepository,
  DurableFitnessPlanRepository,
  DurableCompletedWorkoutRepository,
} from '@bene/training-infra';

// Assuming this is your concrete database client/connection
import { createDOClient, DOClient } from '@bene/persistence';

/**
 * A factory responsible for instantiating all concrete Repository implementations.
 */
export class RepositoryFactory {
  // Private properties for lazy caching
  private _userProfileRepo?: UserProfileRepository;
  private _completedWorkoutRepo?: CompletedWorkoutRepository;
  private _fitnessPlanRepo?: FitnessPlanRepository;
  private _workoutSessionRepo?: WorkoutSessionRepository;
  private db: DOClient<unknown>;

  constructor(storage: DurableObjectStorage) {
    this.db = createDOClient(storage);
  }

  // --- Public Getters (Lazy-Loaded) ---

  public getUserProfileRepository(): UserProfileRepository {
    if (!this._userProfileRepo) {
      this._userProfileRepo = new DurableUserProfileRepository(this.db);
    }
    return this._userProfileRepo;
  }

  public getCompletedWorkoutRepository(): CompletedWorkoutRepository {
    if (!this._completedWorkoutRepo) {
      this._completedWorkoutRepo = new DurableCompletedWorkoutRepository(this.db);
    }
    return this._completedWorkoutRepo;
  }

  public getFitnessPlanRepository(): FitnessPlanRepository {
    if (!this._fitnessPlanRepo) {
      this._fitnessPlanRepo = new DurableFitnessPlanRepository(this.db);
    }
    return this._fitnessPlanRepo;
  }

  public getWorkoutSessionRepository(): WorkoutSessionRepository {
    if (!this._workoutSessionRepo) {
      this._workoutSessionRepo = new DurableWorkoutSessionRepository(this.db); // Placeholder
    }
    return this._workoutSessionRepo;
  }
}
