import { EventBus } from '@bene/shared-domain';
import {
  GetTodaysWorkoutUseCase,
  StartWorkoutUseCase,
  CompleteWorkoutUseCase,
  JoinMultiplayerWorkoutUseCase,
  AddWorkoutReactionUseCase,
  SkipWorkoutUseCase,
} from '@bene/training-application';

import { AIServiceAdapter } from '../adapters/ai-service.adapter';
import { RepositoryFactory } from './repository-factory';

export class UseCaseFactory {
  // Private properties for lazy caching of all Use Cases
  private _getTodaysWorkoutUC: GetTodaysWorkoutUseCase | null = null;
  private _startWorkoutUC: StartWorkoutUseCase | null = null;
  private _completeWorkoutUC: CompleteWorkoutUseCase | null = null;
  private _joinMultiplayerWorkoutUC: JoinMultiplayerWorkoutUseCase | null = null;
  private _addWorkoutReactionUC: AddWorkoutReactionUseCase | null = null;
  private _skipWorkoutUC: SkipWorkoutUseCase | null = null;

  constructor(
    private repoFactory: RepositoryFactory,
    private aiService: AIServiceAdapter,
    private eventBus: EventBus,
  ) { }

  // --- Public Getters (Lazy-Loaded Implementation) ---

  public getGetTodaysWorkoutUseCase(): GetTodaysWorkoutUseCase {
    if (!this._getTodaysWorkoutUC) {
      this._getTodaysWorkoutUC = new GetTodaysWorkoutUseCase(
        this.repoFactory.getFitnessPlanRepository(),
      );
    }
    return this._getTodaysWorkoutUC;
  }

  public getStartWorkoutUseCase(): StartWorkoutUseCase {
    if (!this._startWorkoutUC) {
      this._startWorkoutUC = new StartWorkoutUseCase(
        this.repoFactory.getWorkoutSessionRepository(),
        this.eventBus,
      );
    }
    return this._startWorkoutUC;
  }

  public getCompleteWorkoutUseCase(): CompleteWorkoutUseCase {
    if (!this._completeWorkoutUC) {
      this._completeWorkoutUC = new CompleteWorkoutUseCase(
        this.repoFactory.getWorkoutSessionRepository(),
        this.repoFactory.getCompletedWorkoutRepository(),
        this.repoFactory.getUserProfileRepository(),
        this.eventBus,
      );
    }
    return this._completeWorkoutUC;
  }

  public getJoinMultiplayerWorkoutUseCase(): JoinMultiplayerWorkoutUseCase {
    if (!this._joinMultiplayerWorkoutUC) {
      this._joinMultiplayerWorkoutUC = new JoinMultiplayerWorkoutUseCase(
        this.repoFactory.getWorkoutSessionRepository(),
        this.eventBus,
      );
    }
    return this._joinMultiplayerWorkoutUC;
  }

  public getAddWorkoutReactionUseCase(): AddWorkoutReactionUseCase {
    if (!this._addWorkoutReactionUC) {
      this._addWorkoutReactionUC = new AddWorkoutReactionUseCase(
        this.repoFactory.getCompletedWorkoutRepository(),
        this.eventBus,
      );
    }
    return this._addWorkoutReactionUC;
  }



  public getSkipWorkoutUseCase(): SkipWorkoutUseCase {
    if (!this._skipWorkoutUC) {
      this._skipWorkoutUC = new SkipWorkoutUseCase(
        this.repoFactory.getFitnessPlanRepository(),
        this.eventBus,
      );
    }
    return this._skipWorkoutUC;
  }
}
