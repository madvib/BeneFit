// Profile module exports

// Use cases
export { CreateUserProfileUseCase } from './use-cases/create-user-profile/create-user-profile.js';
export type { CreateUserProfileRequest, CreateUserProfileResponse } from './use-cases/create-user-profile/create-user-profile.js';

export { UpdateFitnessGoalsUseCase } from './use-cases/update-fitness-goals/update-fitness-goals.js';
export type { UpdateFitnessGoalsRequest, UpdateFitnessGoalsResponse } from './use-cases/update-fitness-goals/update-fitness-goals.js';

export { UpdateTrainingConstraintsUseCase } from './use-cases/update-training-constraints/update-training-constraints.js';
export type { UpdateTrainingConstraintsRequest, UpdateTrainingConstraintsResponse } from './use-cases/update-training-constraints/update-training-constraints.js';

export { UpdatePreferencesUseCase } from './use-cases/update-preferences/update-preferences.js';
export type { UpdatePreferencesRequest, UpdatePreferencesResponse } from './use-cases/update-preferences/update-preferences.js';

export { GetUserStatsUseCase } from './use-cases/get-user-stats/get-user-stats.js';
export type { GetUserStatsRequest, GetUserStatsResponse } from './use-cases/get-user-stats/get-user-stats.js';

export { GetProfileUseCase } from './use-cases/get-profile/get-profile.js';
export type { GetProfileRequest, GetProfileResponse } from './use-cases/get-profile/get-profile.js';

// Repository
export type { UserProfileRepository } from './repositories/user-profile-repository.js';