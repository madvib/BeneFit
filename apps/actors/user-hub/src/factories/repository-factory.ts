import { type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import {
  UserProfileRepository,
  CompletedWorkoutRepository,
  FitnessPlanRepository,
} from '@bene/training-application';
import { CoachConversationRepository } from '@bene/coach-domain';
import { ConnectedServiceRepository } from '@bene/integrations-domain';

import { user_do_schema } from '../data/schema';
import {
  DurableCoachConversationRepository,
  DurableConnectedServiceRepository,
  DurableUserProfileRepository,
  DurableFitnessPlanRepository,
  DurableCompletedWorkoutRepository,
} from '../repositories';

/**
 * A factory responsible for instantiating all concrete Repository implementations.
 */
export class RepositoryFactory {
  private _userProfileRepo?: UserProfileRepository;
  private _completedWorkoutRepo?: CompletedWorkoutRepository;
  private _fitnessPlanRepo?: FitnessPlanRepository;
  private _coachConversationRepo?: CoachConversationRepository;
  private _connectedServiceRepo?: ConnectedServiceRepository;

  private db: DrizzleSqliteDODatabase<typeof user_do_schema>;

  constructor(storage: DurableObjectStorage) {
    this.db = drizzle(storage, { schema: user_do_schema });
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
