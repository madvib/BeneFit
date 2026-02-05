import {
  StartWorkoutUseCase,
  CompleteWorkoutUseCase,
  JoinMultiplayerWorkoutUseCase,
  AddWorkoutReactionUseCase,
} from '@bene/training-application';

import { RepositoryFactory } from './repository-factory';
import { ServiceFactory } from './service-factory';

export class UseCaseFactory {
  // Private properties for lazy caching of all Use Cases
  private _startWorkoutUC?: StartWorkoutUseCase;
  private _completeWorkoutUC?: CompleteWorkoutUseCase;
  private _joinMultiplayerWorkoutUC?: JoinMultiplayerWorkoutUseCase;
  private _addWorkoutReactionUC?: AddWorkoutReactionUseCase;

  constructor(
    private repoFactory: RepositoryFactory,
    private serviceFactory: ServiceFactory,
  ) {}

  // --- Public Getters (Lazy-Loaded Implementation) ---

  public getStartWorkoutUseCase(): StartWorkoutUseCase {
    if (!this._startWorkoutUC) {
      this._startWorkoutUC = new StartWorkoutUseCase(
        this.repoFactory.getWorkoutSessionRepository(),
        this.serviceFactory.getEventBus(),
      );
    }
    return this._startWorkoutUC;
  }

  public getCompleteWorkoutUseCase(): CompleteWorkoutUseCase {
    if (!this._completeWorkoutUC) {
      this._completeWorkoutUC = new CompleteWorkoutUseCase(
        this.repoFactory.getWorkoutSessionRepository(),

        this.serviceFactory.getEventBus(),
      );
    }
    return this._completeWorkoutUC;
  }

  public getJoinMultiplayerWorkoutUseCase(): JoinMultiplayerWorkoutUseCase {
    if (!this._joinMultiplayerWorkoutUC) {
      this._joinMultiplayerWorkoutUC = new JoinMultiplayerWorkoutUseCase(
        this.repoFactory.getWorkoutSessionRepository(),
        this.serviceFactory.getEventBus(),
      );
    }
    return this._joinMultiplayerWorkoutUC;
  }

  public getAddWorkoutReactionUseCase(): AddWorkoutReactionUseCase {
    if (!this._addWorkoutReactionUC) {
      this._addWorkoutReactionUC = new AddWorkoutReactionUseCase(
        this.serviceFactory.getEventBus(),
      );
    }
    return this._addWorkoutReactionUC;
  }
}
