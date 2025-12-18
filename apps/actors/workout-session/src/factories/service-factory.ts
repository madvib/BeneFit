import { AIServiceAdapter } from '../adapters/ai-service.adapter';
import { EventBusAdapter } from '../adapters/event-bus.adapter';

export class ServiceFactory {
  private _aiService?: AIServiceAdapter;
  private _eventBus?: EventBusAdapter;

  constructor(private env: Env) { }

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
}