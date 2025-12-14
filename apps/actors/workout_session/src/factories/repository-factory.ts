import {
  UserProfileRepository,
  CompletedWorkoutRepository,
  FitnessPlanRepository,
  PlanTemplateRepository,
  WorkoutSessionRepository,
} from '@bene/training-application';
import {
  DurableWorkoutSessionRepository,
  DurableUserProfileRepository,
  DurableFitnessPlanRepository,
  DurableCompletedWorkoutRepository,
  D1PlanTemplateRepository,
} from '@bene/training-infra';

// Assuming this is your concrete database client/connection
import { createD1Client, createDOClient, D1Client, DOClient } from '@bene/persistence';

/**
 * A factory responsible for instantiating all concrete Repository implementations.
 */
export class RepositoryFactory {
  // Private properties for lazy caching
  private _userProfileRepo: UserProfileRepository | null = null;
  private _completedWorkoutRepo: CompletedWorkoutRepository | null = null;
  private _fitnessPlanRepo: FitnessPlanRepository | null = null;
  private _planTemplateRepo: PlanTemplateRepository | null = null;
  private _workoutSessionRepo: WorkoutSessionRepository | null = null;
  private db: DOClient<any>;
  private d1DB: D1Client;

  constructor(storage: DurableObjectStorage, planTemplateDB: D1Database) {
    this.db = createDOClient(storage);
    this.d1DB = createD1Client(planTemplateDB);
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
    return this._fitnessPlanRepo!;
  }

  public getPlanTemplateRepository(): PlanTemplateRepository {
    if (!this._planTemplateRepo) {
      this._planTemplateRepo = new D1PlanTemplateRepository(this.d1DB);
    }
    return this._planTemplateRepo;
  }

  public getWorkoutSessionRepository(): WorkoutSessionRepository {
    if (!this._workoutSessionRepo) {
      this._workoutSessionRepo = new DurableWorkoutSessionRepository(this.db); // Placeholder
    }
    return this._workoutSessionRepo;
  }
}
