import { Agent } from 'agents';
import { initializeUserHubDB } from '@bene/persistence';
import { UseCaseFactory } from '../factories';
import { AIServiceAdapter, EventBusAdapter } from '../adapters';
import { WorkoutsFacade } from '../facades/workouts.facade';

// Define the state interface for TypeScript
interface WorkoutSessionState {
  currentSession?: any; // Would be more specific in real implementation
}

export default class WorkoutSession extends Agent<Env, WorkoutSessionState> {
  // Lazy-loaded factories
  private _useCaseFactory?: UseCaseFactory;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      await initializeUserHubDB(ctx.storage, env);
    });
  }

  // ===== Factory Getters =====

  private get useCaseFactory() {
    if (!this._useCaseFactory) {
      // Create the UseCaseFactory with the necessary dependencies
      const aiService = new AIServiceAdapter(this.env.AI_SERVICE);
      const eventBus = new EventBusAdapter(this.env.EVENT_BUS);
      // Note: In a real scenario, we might need a specific DB initialization for workout session if it differs
      this._useCaseFactory = new UseCaseFactory(this.db, aiService, eventBus);
    }
    return this._useCaseFactory;
  }

  // Facades
  private _workoutsFacade: WorkoutsFacade | null = null;

  get workouts(): WorkoutsFacade {
    if (!this._workoutsFacade) {
      this._workoutsFacade = new WorkoutsFacade(this.useCaseFactory);
    }
    return this._workoutsFacade;
  }


  // ===== WEBSOCKET (Real-Time) =====

  async onWebSocketMessage(ws: WebSocket, message: string) {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'start_workout':
        const session = await this.workouts.start({
          userId: data.userId,
          workoutId: data.workoutId, // This might not be in StartWorkoutRequest directly if using plan?
          // StartWorkoutRequest needs: userId, userName, etc.
          // This WS message seems to assume different shape.
          // mapping:
          userName: data.userName || 'User',
          workoutType: data.workoutType || 'custom',
          activities: data.activities || [],
          ...data
        } as any);
        ws.send(JSON.stringify({ type: 'workout_started', session }));
        break;

      case 'complete_workout':
        const completed = await this.workouts.complete({
          sessionId: data.sessionId,
          userId: data.userId,
          // CompleteWorkoutRequest fields mapping
          endedAt: new Date(),
          durationMinutes: data.durationMinutes || 30,
          perceivedExertion: data.perceivedExertion || 5, // Default
          ...data
        } as any);
        ws.send(JSON.stringify({ type: 'workout_completed', completed }));
        break;
    }
  }
}
