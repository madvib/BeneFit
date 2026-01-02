import { Agent } from 'agents';
import { initializeUserHubDB } from '../data/init';
import { ServiceFactory, RepositoryFactory, UseCaseFactory } from '../factories/index';
import {
  ProfileFacade,
  WorkoutsFacade,
  PlanningFacade,
  IntegrationsFacade,
  CoachFacade,
} from '../facades/index';

interface UserHubState {
  currentSession?: unknown;
  activePlans?: unknown[];
  coachConversation?: unknown[];
}

export class UserHub extends Agent<Env, UserHubState> {
  // Lazy-loaded dependencies
  private _useCaseFactory?: UseCaseFactory;
  private _serviceFactory?: ServiceFactory;
  private _repositoryFactory?: RepositoryFactory;
  // Facades
  private _workouts?: WorkoutsFacade;
  private _profile?: ProfileFacade;
  private _planning?: PlanningFacade;
  private _integrations?: IntegrationsFacade;

  // Features
  private _coach?: CoachFacade;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      await initializeUserHubDB(ctx.storage);
    });
  }

  // ===== PUBLIC FACADES (RPC Entry Points) =====

  async workouts() {
    if (!this._workouts) {
      this._workouts = new WorkoutsFacade(this.useCaseFactory);
    }
    return this._workouts;
  }

  async profile() {
    if (!this._profile) {
      this._profile = new ProfileFacade(this.useCaseFactory);
    }
    return this._profile;
  }

  async planning() {
    if (!this._planning) {
      return new PlanningFacade(this.useCaseFactory);
    }
    return this._planning;
  }

  async integrations() {
    if (!this._integrations) {
      this._integrations = new IntegrationsFacade(this.useCaseFactory);
    }
    return this._integrations;
  }

  async coach() {
    if (!this._coach) {
      this._coach = new CoachFacade(this.useCaseFactory);
    }
    return this._coach;
  }

  // ===== WEBSOCKET HANDLING =====

  async onWebSocketMessage(ws: WebSocket, message: string) {
    const data = JSON.parse(message);

    switch (data.type) {
      // case 'chat':
      //   await this.coach.handleMessage(ws, data);
      //   break;

      case 'subscribe':
        // Subscription logic usually requires access to local state,
        // so it might reside here or in a specialized "ConnectionManager"
        ws.send(JSON.stringify({ type: 'connected', userId: data.userId }));
        break;

      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  // ===== SCHEDULED TASKS =====

  async onAlarm() {
    // Simple alarm router if needed
    console.log('UserHub: Alarm fired');
  }
  // ===== INTERNAL DEPENDENCIES =====

  private get useCaseFactory() {
    if (!this._useCaseFactory) {
      this._useCaseFactory = new UseCaseFactory(this.repositories, this.services);
    }
    return this._useCaseFactory;
  }
  private get repositories() {
    if (!this._repositoryFactory) {
      this._repositoryFactory = new RepositoryFactory(this.ctx.storage);
    }
    return this._repositoryFactory;
  }
  private get services() {
    if (!this._serviceFactory) {
      this._serviceFactory = new ServiceFactory(this.env, this.repositories);
    }
    return this._serviceFactory;
  }
}
