// Planning module exports

// Use cases
export { GeneratePlanFromGoalsUseCase } from './use-cases/generate-plan-from-goals/generate-plan-from-goals.js';
export type {
  GeneratePlanFromGoalsRequest,
  GeneratePlanFromGoalsResponse,
} from './use-cases/generate-plan-from-goals/generate-plan-from-goals.js';

export { ActivatePlanUseCase } from './use-cases/activate-plan/activate-plan.js';
export type {
  ActivatePlanRequest,
  ActivatePlanResponse,
} from './use-cases/activate-plan/activate-plan.js';

export { GetTodaysWorkoutUseCase } from './use-cases/get-todays-workout/get-todays-workout.js';
export type {
  GetTodaysWorkoutRequest,
  GetTodaysWorkoutResponse,
} from './use-cases/get-todays-workout/get-todays-workout.js';

export { AdjustPlanBasedOnFeedbackUseCase } from './use-cases/adjust-plan-based-on-feedback/adjust-plan-based-on-feedback.js';
export type {
  AdjustPlanRequest,
  AdjustPlanResponse,
} from './use-cases/adjust-plan-based-on-feedback/adjust-plan-based-on-feedback.js';

export { PausePlanUseCase } from './use-cases/pause-plan/pause-plan.js';
export type {
  PausePlanRequest,
  PausePlanResponse,
} from './use-cases/pause-plan/pause-plan.js';

export { GetUpcomingWorkoutsUseCase } from './use-cases/get-upcoming-workouts/get-upcoming-workouts.js';
export type {
  GetUpcomingWorkoutsRequest,
  GetUpcomingWorkoutsResponse,
} from './use-cases/get-upcoming-workouts/get-upcoming-workouts.js';

// Profile module exports

// Use cases
export { CreateUserProfileUseCase } from './use-cases/create-user-profile/create-user-profile.js';
export type {
  CreateUserProfileRequest,
  CreateUserProfileResponse,
} from './use-cases/create-user-profile/create-user-profile.js';

export { UpdateFitnessGoalsUseCase } from './use-cases/update-fitness-goals/update-fitness-goals.js';
export type {
  UpdateFitnessGoalsRequest,
  UpdateFitnessGoalsResponse,
} from './use-cases/update-fitness-goals/update-fitness-goals.js';

export { UpdateTrainingConstraintsUseCase } from './use-cases/update-training-constraints/update-training-constraints.js';
export type {
  UpdateTrainingConstraintsRequest,
  UpdateTrainingConstraintsResponse,
} from './use-cases/update-training-constraints/update-training-constraints.js';

export { UpdatePreferencesUseCase } from './use-cases/update-preferences/update-preferences.js';
export type {
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
} from './use-cases/update-preferences/update-preferences.js';

export { GetUserStatsUseCase } from './use-cases/get-user-stats/get-user-stats.js';
export type {
  GetUserStatsRequest,
  GetUserStatsResponse,
} from './use-cases/get-user-stats/get-user-stats.js';

export { GetProfileUseCase } from './use-cases/get-profile/get-profile.js';
export type {
  GetProfileRequest,
  GetProfileResponse,
} from './use-cases/get-profile/get-profile.js';

export { SkipWorkoutUseCase } from './use-cases/skip-workout/skip-workout.js';
export type {
  SkipWorkoutRequest,
  SkipWorkoutResponse,
} from './use-cases/skip-workout/skip-workout.js';

// Repository
export * from './repositories/completed-workout-repository.js';
export type { UserProfileRepository } from './repositories/user-profile-repository.js';
export * from './repositories/workout-session-repository.js';

export * from './use-cases/add-workout-reaction/add-workout-reaction.js';
export * from './use-cases/complete-workout/complete-workout.js';
export * from './use-cases/get-workout-history/get-workout-history.js';
export * from './use-cases/join-multiplayer-workout/join-multiplayer-workout.js';
export * from './use-cases/start-workout/start-workout.js';

// Repository
export type { FitnessPlanRepository } from './repositories/fitness-plan-repository.js';
export type { PlanTemplateRepository } from './repositories/plan-template-repository.js';

// Services
export * from './services/index.js';  
