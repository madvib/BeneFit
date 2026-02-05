import { AIPlanGenerator } from '@bene/training-application';
import { AIServiceAdapter } from '../adapters/ai-service.adapter';
import { EventBusAdapter } from '../adapters/event-bus.adapter';
import { AICoachService, CoachContextBuilder } from '@bene/coach-domain';
import { RepositoryFactory } from './repository-factory';

export class ServiceFactory {
  private _aiService?: AIServiceAdapter;
  private _eventBus?: EventBusAdapter;
  private _aiCoachService?: AICoachService;
  private _coachContextBuilder?: CoachContextBuilder;

  constructor(
    private env: Env,
    private repoFactory: RepositoryFactory
  ) { }

  getAIService(): AIServiceAdapter {
    if (!this._aiService) {
      this._aiService = new AIServiceAdapter(this.env.AI_SERVICE);
    }
    return this._aiService;
  }

  getEventBus(): EventBusAdapter {
    if (!this._eventBus) {
      this._eventBus = new EventBusAdapter(this.env.EVENT_BUS);
    }
    return this._eventBus;
  }

  getAIPlanGenerator(): AIPlanGenerator {
    return new AIPlanGenerator(this.getAIService());
  }

  getAICoachService(): AICoachService {
    if (!this._aiCoachService) {
      this._aiCoachService = new AICoachService(this.getAIService());
    }
    return this._aiCoachService;
  }

  getCoachContextBuilder(): CoachContextBuilder {
    if (!this._coachContextBuilder) {
      this._coachContextBuilder = new CoachContextBuilder(
        this.repoFactory.getUserProfileRepository(),
        this.repoFactory.getCompletedWorkoutRepository(),
        this.repoFactory.getFitnessPlanRepository()
      );
    }
    return this._coachContextBuilder;
  }
}