import { Agent } from 'agents';
import { AdjustPlanRequest } from '@bene/training-application';
import { initializeUserHubDB } from '@bene/persistence';
import { initializeUserHubDB } from '@bene/persistence';
import { QueryFactory, UseCaseFactory, ServiceFactory, RepositoryFactory } from '../factories';

// Define the state interface for TypeScript
interface UserHubState {
  currentSession?: any; // Would be more specific in real implementation
  activePlans?: any[];
  coachConversation?: any[];
}

export default class UserHub extends Agent<Env, UserHubState> {
  // Lazy-loaded factories
  private _queries?: QueryFactory;
  private _useCaseFactory?: UseCaseFactory;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      await initializeUserHubDB(ctx.storage, env);
    });
  }

  // ===== Factory Getters =====

  private get queries() {
    if (!this._queries) {
      this._queries = new QueryFactory(this.ctx.storage);
    }
    return this._queries;
  }

  private get useCaseFactory() {
    if (!this._useCaseFactory) {
      // Create factories
      // Assuming RepositoryFactory is exported from '../factories' or needs direct import
      // We need to import ServiceFactory and RepositoryFactory
      const repoFactory = new RepositoryFactory(this.ctx.storage, this.env.PLAN_TEMPLATE_DB);
      const serviceFactory = new ServiceFactory(this.env, repoFactory);

      this._useCaseFactory = new UseCaseFactory(repoFactory, serviceFactory);
    }
    return this._useCaseFactory;
  }

  // ===== QUERIES (Fast Path) =====

  async getUserProfile(userId: string) {
    return await this.queries.getUserProfileQuery().execute({ userId });
  }

  async getActivePlan(userId: string) {
    return await this.queries.getActivePlanQuery().execute({ userId });
  }

  async getTodaysWorkout(userId: string) {
    return await this.queries.getTodaysWorkoutQuery().execute({ userId });
  }

  async getWorkoutHistory(userId: string, limit?: number) {
    return await this.queries
      .getWorkoutHistoryQuery()
      .execute({ userId, limit: limit || 10 });
  }

  // ===== USE CASE METHODS (Factory Pattern) =====

  async startWorkout(input: { userId: string; workoutId: string }) {
    const startWorkoutUseCase = this.useCaseFactory.getStartWorkoutUseCase();

    const result = await startWorkoutUseCase.execute(input);

    // Update local state
    await this.state.put('currentSession', result);

    return result;
  }

  async completeWorkout(input: { sessionId: string; performanceData: any }) {
    const completeWorkoutUseCase = this.useCaseFactory.getCompleteWorkoutUseCase();

    const result = await completeWorkoutUseCase.execute(input);

    // Update local state
    const currentSession = await this.state.get('currentSession');
    if (currentSession && currentSession.id === input.sessionId) {
      await this.state.put('currentSession', null);
    }

    // Broadcast to connected clients
    this.broadcast({ type: 'workout_completed', completedWorkout: result });

    return result;
  }

  async generatePlanFromGoals(input: {
    userId: string;
    goals: string[];
    constraints: any;
  }) {
    const generatePlanFromGoalsUseCase =
      this.useCaseFactory.getGeneratePlanFromGoalsUseCase();

    const result = await generatePlanFromGoalsUseCase.execute(input);

    // Update local state
    let activePlans = await this.state.get('activePlans');
    if (!activePlans) activePlans = [];
    activePlans = [...activePlans, result];
    await this.state.put('activePlans', activePlans);

    // Broadcast to connected clients
    this.broadcast({ type: 'plan_generated', plan: result });

    return result;
  }

  async activatePlan(input: { userId: string; planId: string }) {
    const activatePlanUseCase = this.useCaseFactory.getActivatePlanUseCase();

    return await activatePlanUseCase.execute(input);
  }

  async skipWorkout(input: { userId: string; workoutId: string; reason: string }) {
    const skipWorkoutUseCase = this.useCaseFactory.getSkipWorkoutUseCase();

    return await skipWorkoutUseCase.execute(input);
  }

  async createUserProfile(input: {
    userId: string;
    name: string;
    fitnessGoals: string[];
  }) {
    const createUserProfileUseCase = this.useCaseFactory.getCreateUserProfileUseCase();

    return await createUserProfileUseCase.execute(input);
  }

  async getProfile(input: { userId: string }) {
    return await this.useCaseFactory.getGetProfileUseCase().execute(input);
  }

  async updateFitnessGoals(input: { userId: string; goals: string[] }) {
    const updateFitnessGoalsUseCase =
      this.useCaseFactory.getUpdateFitnessGoalsUseCase();

    return await updateFitnessGoalsUseCase.execute(input);
  }

  async updateTrainingConstraints(input: { userId: string; constraints: any }) {
    const updateTrainingConstraintsUseCase =
      this.useCaseFactory.getUpdateTrainingConstraintsUseCase();

    return await updateTrainingConstraintsUseCase.execute(input);
  }

  async updatePreferences(input: { userId: string; preferences: any }) {
    const updatePreferencesUseCase = this.useCaseFactory.getUpdatePreferencesUseCase();

    return await updatePreferencesUseCase.execute(input);
  }

  async getUserStats(input: { userId: string }) {
    const getUserStatsUseCase = this.useCaseFactory.getGetUserStatsUseCase();

    return await getUserStatsUseCase.execute(input);
  }

  async adjustPlanBasedOnFeedback(input: AdjustPlanRequest) {
    const adjustPlanUseCase = this.useCaseFactory.getAdjustPlanBasedOnFeedbackUseCase();

    return await adjustPlanUseCase.execute(input);
  }

  async pausePlan(input: { userId: string; planId: string }) {
    const pausePlanUseCase = this.useCaseFactory.getPausePlanUseCase();

    return await pausePlanUseCase.execute(input);
  }

  async sendMessageToCoach(input: { userId: string; message: string }) {
    // For now, using startWorkout as placeholder since coaching use case may not exist in factory
    const sendMessageToCoachUseCase = this.useCaseFactory.getStartWorkoutUseCase();

    const result = await sendMessageToCoachUseCase.execute(input);

    // Update conversation state
    let currentConversation = await this.state.get('coachConversation');
    if (!currentConversation) currentConversation = [];
    currentConversation = [...currentConversation, result];
    await this.state.put('coachConversation', currentConversation);

    // Broadcast to connected clients
    this.broadcast({ type: 'coach_message', response: result });

    return result;
  }

  async getCoachingHistory(input: { userId: string }) {
    // For now, using getProfile as placeholder since coaching history use case may not exist in factory
    const getCoachingHistoryUseCase = this.useCaseFactory.getGetProfileUseCase();

    return await getCoachingHistoryUseCase.execute(input);
  }

  async getUpcomingWorkouts(input: { userId: string }) {
    const getUpcomingWorkoutsUseCase =
      this.useCaseFactory.getGetUpcomingWorkoutsUseCase();

    return await getUpcomingWorkoutsUseCase.execute(input);
  }

  // ===== WEBSOCKET (Real-Time) =====

  async onWebSocketMessage(ws: WebSocket, message: string) {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'chat':
        await this.handleChat(ws, data.message, data.userId);
        break;

      case 'subscribe':
        this.handleSubscribe(ws, data.userId);
        break;

      case 'start_workout':
        const session = await this.startWorkout(data.userId, data.workoutId);
        ws.send(JSON.stringify({ type: 'workout_started', session }));
        break;

      case 'complete_workout':
        const completed = await this.completeWorkout(
          data.sessionId,
          data.performanceData,
        );
        ws.send(JSON.stringify({ type: 'workout_completed', completed }));
        break;

      case 'get_todays_workout':
        const workout = await this.getTodaysWorkout(data.userId);
        ws.send(JSON.stringify({ type: 'todays_workout', workout }));
        break;

      case 'generate_plan':
        const plan = await this.generatePlanFromGoals(
          data.userId,
          data.goals,
          data.constraints,
        );
        ws.send(JSON.stringify({ type: 'plan_generated', plan }));
        break;
    }
  }

  private async handleChat(ws: WebSocket, message: string, userId: string) {
    const container = getContainer();
    const useCase = container.get('sendMessageToCoachUseCase'); // Would use actual coaching use case

    const response = await useCase.execute(
      { userId, message },
      { userId }, // context
    );

    ws.send(JSON.stringify({ type: 'chat_response', response }));
  }

  private async handleSubscribe(ws: WebSocket, userId: string) {
    // Tag WebSocket with user ID for targeted broadcasts
    (ws as any).userId = userId;

    // Get current session and plans from state
    const currentSession = await this.state.get('currentSession');
    const activePlans = (await this.state.get('activePlans')) || [];

    ws.send(
      JSON.stringify({
        type: 'connected',
        userId,
        timestamp: new Date().toISOString(),
        currentSession,
        activePlans,
      }),
    );
  }

  // ===== SCHEDULED TASKS =====

  async onAlarm() {
    // Agent SDK handles this - processes all scheduled tasks
    console.log('Processing scheduled tasks in UserHub...');

    // Could handle reminders, scheduled notifications, etc.
    // The Agent SDK provides enhanced scheduling capabilities
  }
}
