import { Agent } from 'agents';
import { initializeUserHubDB } from '@bene/persistence';
import { UseCaseFactory } from '../factories';
import { RepositoryFactory } from '../factories/repository-factory';
import { ServiceFactory } from '../factories/service-factory';
import { WorkoutsFacade } from '../facades/workouts.facade';
import { ProfileFacade } from '../facades/profile.facade';
import { PlanningFacade } from '../facades/planning.facade';
import { IntegrationsFacade } from '../facades/integrations.facade';
import { CoachFeature } from '../features/coach/coach.feature';

// Define the state interface for TypeScript
interface UserHubState {
  currentSession?: any;
  activePlans?: any[];
  coachConversation?: any[];
}

export default class UserHubV2 extends Agent<Env, UserHubState> {
  // Lazy-loaded dependencies
  private _useCaseFactory?: UseCaseFactory;
  private _serviceFactory?: ServiceFactory;

  // Facades
  private _workouts?: WorkoutsFacade;
  private _profile?: ProfileFacade;
  private _planning?: PlanningFacade;
  private _integrations?: IntegrationsFacade;

  // Features
  private _coach?: CoachFeature;

  private db: any; // Placeholder type, ideally DOClient<Schema>

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      await initializeUserHubDB(ctx.storage, env);
    });
  }

  // ===== PUBLIC FACADES (RPC Entry Points) =====

  get workouts() {
    if (!this._workouts) {
      this._workouts = new WorkoutsFacade(this.useCaseFactory);
    }
    return this._workouts;
  }

  get profile() {
    if (!this._profile) {
      this._profile = new ProfileFacade(this.useCaseFactory);
    }
    return this._profile;
  }

  get planning() {
    if (!this._planning) {
      this._planning = new PlanningFacade(this.useCaseFactory);
    }
    return this._planning;
  }

  get integrations() {
    if (!this._integrations) {
      this._integrations = new IntegrationsFacade(this.useCaseFactory);
    }
    return this._integrations;
  }

  get coach() {
    if (!this._coach) {
      this._coach = new CoachFeature(this.ctx, this.useCaseFactory);
    }
    return this._coach;
  }

  // ===== WEBSOCKET HANDLING =====

  async onWebSocketMessage(ws: WebSocket, message: string) {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'chat':
        await this.coach.handleMessage(ws, data);
        break;

      case 'subscribe':
        // Subscription logic usually requires access to local state,
        // so it might reside here or in a specialized "ConnectionManager"
        ws.send(JSON.stringify({ type: 'connected', userId: data.userId }));
        break;

      case 'start_workout':
        const session = await this.workouts.start({
          userId: data.userId,
          workoutId: data.workoutId,
        });
        ws.send(JSON.stringify({ type: 'workout_started', session }));
        break;

      case 'complete_workout':
        const completed = await this.workouts.complete({
          sessionId: data.sessionId,
          performanceData: data.performanceData,
        });
        ws.send(JSON.stringify({ type: 'workout_completed', completed }));
        break;

      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  // ===== SCHEDULED TASKS =====

  async onAlarm() {
    // Simple alarm router if needed
    console.log('UserHubV2: Alarm fired');
  }
  // ===== INTERNAL DEPENDENCIES =====

  private get useCaseFactory() {
    if (!this._useCaseFactory) {
      // Create the UseCaseFactory with the necessary dependencies
      const repositoryFactory = new RepositoryFactory(
        this.ctx.storage,
        this.env.PLAN_TEMPLATE_DB
      );
      const aiService = this.services.getAIService();
      const eventBus = this.services.getEventBus();

      this._useCaseFactory = new UseCaseFactory(
        repositoryFactory,
        aiService,
        eventBus,
      );
    }
    return this._useCaseFactory;
  }

  private get services() {
    if (!this._serviceFactory) {
      this._serviceFactory = new ServiceFactory(this.env);
    }
    return this._serviceFactory;
  }
}
