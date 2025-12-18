// ... existing imports
import {
  UserProfileRepository,
  CompletedWorkoutRepository,
  FitnessPlanRepository,
  PlanTemplateRepository,
  WorkoutSessionRepository,
} from '@bene/training-application';
import {
  CoachConversationRepository,
} from '@bene/coach-domain';
import {
  ConnectedServiceRepository,
} from '@bene/integrations-domain';
import {
  DurableWorkoutSessionRepository,
  DurableUserProfileRepository,
  DurableFitnessPlanRepository,
  DurableCompletedWorkoutRepository,
  D1PlanTemplateRepository,
} from '@bene/training-infra';
import { DurableCoachConversationRepository } from '@bene/coach-infra';
import { DurableConnectedServiceRepository } from '@bene/integrations-infra';

// Assuming this is your concrete database client/connection
import { createD1Client, createDOClient, D1Client, DOClient } from '@bene/persistence';

/**
 * A factory responsible for instantiating all concrete Repository implementations.
 */
export class RepositoryFactory {
  // Private properties for lazy caching
  private _userProfileRepo?: UserProfileRepository;
  private _completedWorkoutRepo?: CompletedWorkoutRepository;
  private _fitnessPlanRepo?: FitnessPlanRepository;
  private _planTemplateRepo?: PlanTemplateRepository;
  private _workoutSessionRepo?: WorkoutSessionRepository;
  // New repos
  private _coachConversationRepo?: CoachConversationRepository;
  private _connectedServiceRepo?: ConnectedServiceRepository;

  private db: DOClient<unknown>;
  private d1DB: D1Client;

  constructor(storage: DurableObjectStorage, planTemplateDB: D1Database) {
    this.db = createDOClient(storage);
    this.d1DB = createD1Client(planTemplateDB);
  }

  // --- Public Getters (Lazy-Loaded) ---

  getUserProfileRepository(): UserProfileRepository {
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

  public getCoachConversationRepository(): CoachConversationRepository {
    if (!this._coachConversationRepo) {
      this._coachConversationRepo = new DurableCoachConversationRepository(this.db);
    }
    return this._coachConversationRepo;
  }

  public getConnectedServiceRepository(): ConnectedServiceRepository {
    if (!this._connectedServiceRepo) {
      this._connectedServiceRepo = new DurableConnectedServiceRepository(this.db);
    }
    return this._connectedServiceRepo;
  }
}
