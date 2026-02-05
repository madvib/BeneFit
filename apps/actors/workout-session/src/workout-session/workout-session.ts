import { Agent } from 'agents';
import { RepositoryFactory, ServiceFactory, UseCaseFactory } from '../factories';
import { WorkoutsFacade } from '../facades/workouts.facade';
import { initializeWorkoutSessionDB } from '../data/init';

// Define the state interface for TypeScript
interface WorkoutSessionState {
  currentSession?: unknown; // Would be more specific in real implementation
}

export default class WorkoutSession extends Agent<Env, WorkoutSessionState> {
  // Lazy-loaded factories
  private _useCaseFactory?: UseCaseFactory;
  private _serviceFactory?: ServiceFactory;
  private _repositoryFactory?: RepositoryFactory;
  // Facades
  private _workoutsFacade: WorkoutsFacade | null = null;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      await initializeWorkoutSessionDB(ctx.storage);
    });
  }

  async workouts() {
    if (!this._workoutsFacade) {
      this._workoutsFacade = new WorkoutsFacade(this.useCaseFactory);
    }
    return this._workoutsFacade;
  }

  // ===== WEBSOCKET (Real-Time) =====

  // async onWebSocketMessage(ws: WebSocket, message: string) {
  //   const data = JSON.parse(message);

  //   switch (data.type) {
  //     case 'start_workout': {
  //       // const session = await (
  //       //   await this.workouts()
  //       // ).start({
  //       //   userId: data.userId,
  //       //   workoutId: data.workoutId,
  //       //   userName: data.userName || 'User',
  //       //   workoutType: data.workoutType || 'custom',
  //       //   activities: data.activities || [],
  //       //   ...data,
  //       // });
  //       ws.send(JSON.stringify({ type: 'workout_started' }));
  //       break;
  //     }

  //     case 'complete_workout': {
  //       // const completed = await (
  //       //   await this.workouts()
  //       // ).complete({
  //       //   sessionId: data.sessionId,
  //       //   userId: data.userId,
  //       //   endedAt: new Date(),
  //       //   durationMinutes: data.durationMinutes || 30,
  //       //   perceivedExertion: data.perceivedExertion || 5, // Default
  //       //   ...data,
  //       // });
  //       ws.send(JSON.stringify({ type: 'workout_completed' }));
  //       break;
  //     }
  //   }
  // }

  // ===== Factory Getters =====

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
      this._serviceFactory = new ServiceFactory(this.env);
    }
    return this._serviceFactory;
  }
}
