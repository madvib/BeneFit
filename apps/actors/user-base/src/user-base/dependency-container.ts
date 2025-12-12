import { EventBus } from '@bene/shared-domain';
import {
  ActivatePlanUseCase,
  GeneratePlanFromGoalsUseCase,
  GetTodaysWorkoutUseCase,
  AdjustPlanBasedOnFeedbackUseCase,
  PausePlanUseCase,
  GetUpcomingWorkoutsUseCase,
  CreateUserProfileUseCase,
  UpdateFitnessGoalsUseCase,
  UpdateTrainingConstraintsUseCase,
  UpdatePreferencesUseCase,
  GetUserStatsUseCase,
  GetProfileUseCase,
  StartWorkoutUseCase,
  CompleteWorkoutUseCase,
  JoinMultiplayerWorkoutUseCase,
  AddWorkoutReactionUseCase,
  GetWorkoutHistoryUseCase,
  SkipWorkoutUseCase,
} from '@bene/training-application';

import {
  UserProfileRepository,
  CompletedWorkoutRepository,
  FitnessPlanRepository,
  PlanTemplateRepository,
  WorkoutSessionRepository,
} from '@bene/training-application';

interface Dependencies {
  // Repositories
  userProfileRepository: UserProfileRepository;
  completedWorkoutRepository: CompletedWorkoutRepository;
  fitnessPlanRepository: FitnessPlanRepository;
  planTemplateRepository: PlanTemplateRepository;
  workoutSessionRepository: WorkoutSessionRepository;

  // EventBus
  eventBus: EventBus;
}

export class DependencyContainer {
  private readonly dependencies: Partial<Dependencies> = {};
  private readonly factories: Map<string, () => unknown> = new Map();

  constructor() {
    this.registerFactories();
  }

  private registerFactories(): void {
    // Repository factories - these should be provided by the environment
    this.factories.set(
      'userProfileRepository',
      () => this.dependencies.userProfileRepository,
    );
    this.factories.set(
      'completedWorkoutRepository',
      () => this.dependencies.completedWorkoutRepository,
    );
    this.factories.set(
      'fitnessPlanRepository',
      () => this.dependencies.fitnessPlanRepository,
    );
    this.factories.set(
      'planTemplateRepository',
      () => this.dependencies.planTemplateRepository,
    );
    this.factories.set(
      'workoutSessionRepository',
      () => this.dependencies.workoutSessionRepository,
    );
    this.factories.set('eventBus', () => this.dependencies.eventBus);

    // Use Case factories
    this.factories.set(
      'activatePlanUseCase',
      () =>
        new ActivatePlanUseCase(
          this.resolve('fitnessPlanRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'addWorkoutReactionUseCase',
      () =>
        new AddWorkoutReactionUseCase(
          this.resolve('completedWorkoutRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'adjustPlanBasedOnFeedbackUseCase',
      () =>
        new AdjustPlanBasedOnFeedbackUseCase(
          this.resolve('fitnessPlanRepository'),
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'completeWorkoutUseCase',
      () =>
        new CompleteWorkoutUseCase(
          this.resolve('workoutSessionRepository'),
          this.resolve('completedWorkoutRepository'),
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),

        ),
    );

    this.factories.set(
      'createUserProfileUseCase',
      () =>
        new CreateUserProfileUseCase(
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'generatePlanFromGoalsUseCase',
      () =>
        new GeneratePlanFromGoalsUseCase(
          this.resolve('planTemplateRepository'),
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'getProfileUseCase',
      () => new GetProfileUseCase(this.resolve('userProfileRepository')),
    );

    this.factories.set(
      'getTodaysWorkoutUseCase',
      () =>
        new GetTodaysWorkoutUseCase(
          this.resolve('fitnessPlanRepository'),
          this.resolve('completedWorkoutRepository'),
        ),
    );

    this.factories.set(
      'getUpcomingWorkoutsUseCase',
      () =>
        new GetUpcomingWorkoutsUseCase(
          this.resolve('completedWorkoutRepository'),
          this.resolve('fitnessPlanRepository'),
        ),
    );

    this.factories.set(
      'getUserStatsUseCase',
      () =>
        new GetUserStatsUseCase(
          this.resolve('userProfileRepository'),
          this.resolve('completedWorkoutRepository'),
        ),
    );

    this.factories.set(
      'getWorkoutHistoryUseCase',
      () =>
        new GetWorkoutHistoryUseCase(
          this.resolve('completedWorkoutRepository'),
          this.resolve('userProfileRepository'),
        ),
    );

    this.factories.set(
      'joinMultiplayerWorkoutUseCase',
      () =>
        new JoinMultiplayerWorkoutUseCase(
          this.resolve('workoutSessionRepository'),
          this.resolve('userProfileRepository'),
        ),
    );

    this.factories.set(
      'pausePlanUseCase',
      () =>
        new PausePlanUseCase(
          this.resolve('fitnessPlanRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'skipWorkoutUseCase',
      () =>
        new SkipWorkoutUseCase(
          this.resolve('fitnessPlanRepository'),
          this.resolve('completedWorkoutRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'startWorkoutUseCase',
      () =>
        new StartWorkoutUseCase(
          this.resolve('completedWorkoutRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'skipWorkoutUseCase',
      () =>
        new SkipWorkoutUseCase(
          this.resolve('fitnessPlanRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'updateFitnessGoalsUseCase',
      () =>
        new UpdateFitnessGoalsUseCase(
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'updatePreferencesUseCase',
      () =>
        new UpdatePreferencesUseCase(
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),
        ),
    );

    this.factories.set(
      'updateTrainingConstraintsUseCase',
      () =>
        new UpdateTrainingConstraintsUseCase(
          this.resolve('userProfileRepository'),
          this.resolve('eventBus'),
        ),
    );
  }

  /**
   * Register a dependency instance
   */
  register<T extends keyof Dependencies>(key: T, instance: Dependencies[T]): void {
    this.dependencies[key] = instance;
  }

  /**
   * Resolve a dependency using lazy loading from factory
   */
  resolve<T>(key: string): T {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Unknown dependency: ${key}`);
    }
    return factory() as T;
  }

  /**
   * Get use case instances
   */
  get activatePlanUseCase(): ActivatePlanUseCase {
    return this.resolve('activatePlanUseCase');
  }

  get addWorkoutReactionUseCase(): AddWorkoutReactionUseCase {
    return this.resolve('addWorkoutReactionUseCase');
  }

  get adjustPlanBasedOnFeedbackUseCase(): AdjustPlanBasedOnFeedbackUseCase {
    return this.resolve('adjustPlanBasedOnFeedbackUseCase');
  }

  get completeWorkoutUseCase(): CompleteWorkoutUseCase {
    return this.resolve('completeWorkoutUseCase');
  }

  get createUserProfileUseCase(): CreateUserProfileUseCase {
    return this.resolve('createUserProfileUseCase');
  }

  get generatePlanFromGoalsUseCase(): GeneratePlanFromGoalsUseCase {
    return this.resolve('generatePlanFromGoalsUseCase');
  }

  get getProfileUseCase(): GetProfileUseCase {
    return this.resolve('getProfileUseCase');
  }

  get getTodaysWorkoutUseCase(): GetTodaysWorkoutUseCase {
    return this.resolve('getTodaysWorkoutUseCase');
  }

  get getUpcomingWorkoutsUseCase(): GetUpcomingWorkoutsUseCase {
    return this.resolve('getUpcomingWorkoutsUseCase');
  }

  get getUserStatsUseCase(): GetUserStatsUseCase {
    return this.resolve('getUserStatsUseCase');
  }

  get getWorkoutHistoryUseCase(): GetWorkoutHistoryUseCase {
    return this.resolve('getWorkoutHistoryUseCase');
  }

  get joinMultiplayerWorkoutUseCase(): JoinMultiplayerWorkoutUseCase {
    return this.resolve('joinMultiplayerWorkoutUseCase');
  }

  get pausePlanUseCase(): PausePlanUseCase {
    return this.resolve('pausePlanUseCase');
  }

  get startWorkoutUseCase(): StartWorkoutUseCase {
    return this.resolve('startWorkoutUseCase');
  }

  get skipWorkoutUseCase(): SkipWorkoutUseCase {
    return this.resolve('skipWorkoutUseCase');
  }

  get updateFitnessGoalsUseCase(): UpdateFitnessGoalsUseCase {
    return this.resolve('updateFitnessGoalsUseCase');
  }

  get updatePreferencesUseCase(): UpdatePreferencesUseCase {
    return this.resolve('updatePreferencesUseCase');
  }

  get updateTrainingConstraintsUseCase(): UpdateTrainingConstraintsUseCase {
    return this.resolve('updateTrainingConstraintsUseCase');
  }

  /**
   * Get repository instances
   */
  get userProfileRepository(): UserProfileRepository {
    return this.resolve('userProfileRepository');
  }

  get completedWorkoutRepository(): CompletedWorkoutRepository {
    return this.resolve('completedWorkoutRepository');
  }

  get fitnessPlanRepository(): FitnessPlanRepository {
    return this.resolve('fitnessPlanRepository');
  }

  get planTemplateRepository(): PlanTemplateRepository {
    return this.resolve('planTemplateRepository');
  }

  get workoutSessionRepository(): WorkoutSessionRepository {
    return this.resolve('workoutSessionRepository');
  }

  get eventBus(): EventBus {
    return this.resolve('eventBus');
  }
}

// Singleton instance
let container: DependencyContainer | null = null;

export const getContainer = (): DependencyContainer => {
  if (!container) {
    container = new DependencyContainer();
  }
  return container;
};
