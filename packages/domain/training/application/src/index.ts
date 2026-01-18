// Use cases
export { GeneratePlanFromGoalsUseCase } from './use-cases/generate-plan-from-goals/generate-plan-from-goals.js';
export type {
  GeneratePlanFromGoalsRequest,
  GeneratePlanFromGoalsResponse,
} from './use-cases/generate-plan-from-goals/generate-plan-from-goals.js';
export {
  GeneratePlanFromGoalsRequestSchema,
} from './use-cases/generate-plan-from-goals/generate-plan-from-goals.js';

export { ActivatePlanUseCase } from './use-cases/activate-plan/activate-plan.js';
export type {
  ActivatePlanRequest,
  ActivatePlanResponse,
} from './use-cases/activate-plan/activate-plan.js';
export {
  ActivatePlanRequestSchema,
} from './use-cases/activate-plan/activate-plan.js';

export { GetTodaysWorkoutUseCase } from './use-cases/get-todays-workout/get-todays-workout.js';
export type {
  GetTodaysWorkoutRequest,
  GetTodaysWorkoutResponse,
} from './use-cases/get-todays-workout/get-todays-workout.js';
export {
  GetTodaysWorkoutRequestSchema,
} from './use-cases/get-todays-workout/get-todays-workout.js';

export { AdjustPlanBasedOnFeedbackUseCase } from './use-cases/adjust-plan-based-on-feedback/adjust-plan-based-on-feedback.js';
export type {
  AdjustPlanBasedOnFeedbackRequest,
  AdjustPlanBasedOnFeedbackResponse,
} from './use-cases/adjust-plan-based-on-feedback/adjust-plan-based-on-feedback.js';
export {
  AdjustPlanBasedOnFeedbackRequestSchema,
} from './use-cases/adjust-plan-based-on-feedback/adjust-plan-based-on-feedback.js';

export { PausePlanUseCase } from './use-cases/pause-plan/pause-plan.js';
export type {
  PausePlanRequest,
  PausePlanResponse,
} from './use-cases/pause-plan/pause-plan.js';
export {
  PausePlanRequestSchema,
} from './use-cases/pause-plan/pause-plan.js';

export { GetUpcomingWorkoutsUseCase } from './use-cases/get-upcoming-workouts/get-upcoming-workouts.js';
export type {
  GetUpcomingWorkoutsRequest,
  GetUpcomingWorkoutsResponse,
} from './use-cases/get-upcoming-workouts/get-upcoming-workouts.js';
export {
  GetUpcomingWorkoutsRequestSchema,
} from './use-cases/get-upcoming-workouts/get-upcoming-workouts.js';

export { GetCurrentPlanUseCase } from './use-cases/get-current-plan/get-current-plan.js';
export type {
  GetCurrentPlanRequest,
  GetCurrentPlanResponse,
} from './use-cases/get-current-plan/get-current-plan.js';
export {
  GetCurrentPlanRequestSchema
} from './use-cases/get-current-plan/get-current-plan.js';

// Profile module exports

// Use cases
export { CreateUserProfileUseCase } from './use-cases/create-user-profile/create-user-profile.js';
export type {
  CreateUserProfileRequest,
  CreateUserProfileResponse,
} from './use-cases/create-user-profile/create-user-profile.js';
export {
  CreateUserProfileRequestSchema,
  CreateUserProfileResponseSchema,
} from './use-cases/create-user-profile/create-user-profile.js';

export { UpdateFitnessGoalsUseCase } from './use-cases/update-fitness-goals/update-fitness-goals.js';
export type {
  UpdateFitnessGoalsRequest,
  UpdateFitnessGoalsResponse,
} from './use-cases/update-fitness-goals/update-fitness-goals.js';
export {
  UpdateFitnessGoalsRequestSchema,
  UpdateFitnessGoalsResponseSchema,
} from './use-cases/update-fitness-goals/update-fitness-goals.js';

export { UpdateTrainingConstraintsUseCase } from './use-cases/update-training-constraints/update-training-constraints.js';
export type {
  UpdateTrainingConstraintsRequest,
  UpdateTrainingConstraintsResponse,
} from './use-cases/update-training-constraints/update-training-constraints.js';
export {
  UpdateTrainingConstraintsRequestSchema,
  UpdateTrainingConstraintsResponseSchema,
} from './use-cases/update-training-constraints/update-training-constraints.js';

export { UpdatePreferencesUseCase } from './use-cases/update-preferences/update-preferences.js';
export type {
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
} from './use-cases/update-preferences/update-preferences.js';
export {
  UpdatePreferencesRequestSchema,
  UpdatePreferencesResponseSchema,
} from './use-cases/update-preferences/update-preferences.js';

export { GetUserStatsUseCase } from './use-cases/get-user-stats/get-user-stats.js';
export type {
  GetUserStatsRequest,
  GetUserStatsResponse,
} from './use-cases/get-user-stats/get-user-stats.js';
export {
  GetUserStatsRequestSchema,
  GetUserStatsResponseSchema,
} from './use-cases/get-user-stats/get-user-stats.js';

export { GetProfileUseCase } from './use-cases/get-profile/get-profile.js';
export type {
  GetProfileRequest,
  GetProfileResponse,
} from './use-cases/get-profile/get-profile.js';
export {
  GetProfileRequestSchema,
  GetProfileResponseSchema,
} from './use-cases/get-profile/get-profile.js';

export { SkipWorkoutUseCase } from './use-cases/skip-workout/skip-workout.js';
export type {
  SkipWorkoutRequest,
  SkipWorkoutResponse,
} from './use-cases/skip-workout/skip-workout.js';
export {
  SkipWorkoutRequestSchema,
} from './use-cases/skip-workout/skip-workout.js';

export { AddWorkoutReactionUseCase } from './use-cases/add-workout-reaction/add-workout-reaction.js';
export type {
  AddWorkoutReactionRequest,
  AddWorkoutReactionResponse,
} from './use-cases/add-workout-reaction/add-workout-reaction.js';
export {
  AddWorkoutReactionRequestSchema,
} from './use-cases/add-workout-reaction/add-workout-reaction.js';

export { CompleteWorkoutUseCase } from './use-cases/complete-workout/complete-workout.js';
export type {
  CompleteWorkoutRequest,
  CompleteWorkoutResponse,
} from './use-cases/complete-workout/complete-workout.js';
export {
  CompleteWorkoutRequestSchema,
} from './use-cases/complete-workout/complete-workout.js';

export { GetWorkoutHistoryUseCase } from './use-cases/get-workout-history/get-workout-history.js';
export type {
  GetWorkoutHistoryRequest,
  GetWorkoutHistoryResponse,
} from './use-cases/get-workout-history/get-workout-history.js';
export {
  GetWorkoutHistoryRequestSchema,
} from './use-cases/get-workout-history/get-workout-history.js';

export { JoinMultiplayerWorkoutUseCase } from './use-cases/join-multiplayer-workout/join-multiplayer-workout.js';
export type {
  JoinMultiplayerWorkoutRequest,
  JoinMultiplayerWorkoutResponse,
} from './use-cases/join-multiplayer-workout/join-multiplayer-workout.js';
export {
  JoinMultiplayerWorkoutRequestSchema,
} from './use-cases/join-multiplayer-workout/join-multiplayer-workout.js';

export { StartWorkoutUseCase } from './use-cases/start-workout/start-workout.js';
export type {
  StartWorkoutRequest,
  StartWorkoutResponse,
} from './use-cases/start-workout/start-workout.js';
export {
  StartWorkoutRequestSchema,
} from './use-cases/start-workout/start-workout.js';

// Events
export * from './events/index.js';

// Repository
export * from './repositories/index.js';

// Services
export * from './services/index.js';
