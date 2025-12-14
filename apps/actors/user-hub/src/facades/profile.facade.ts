
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  GetProfileRequest,
  CreateUserProfileRequest,
  UpdateFitnessGoalsRequest,
  UpdatePreferencesRequest,
  GetUserStatsRequest,
  UpdateTrainingConstraintsRequest
} from '@bene/training-application';

export class ProfileFacade {
  constructor(private useCaseFactory: UseCaseFactory) { }

  async get(input: GetProfileRequest) {
    return this.useCaseFactory.getGetProfileUseCase().execute(input);
  }

  async create(input: CreateUserProfileRequest) {
    return this.useCaseFactory.getCreateUserProfileUseCase().execute(input);
  }

  async updateGoals(input: UpdateFitnessGoalsRequest) {
    return this.useCaseFactory.getUpdateFitnessGoalsUseCase().execute(input);
  }

  async updatePreferences(input: UpdatePreferencesRequest) {
    return this.useCaseFactory.getUpdatePreferencesUseCase().execute(input);
  }

  async getStats(input: GetUserStatsRequest) {
    return this.useCaseFactory.getGetUserStatsUseCase().execute(input);
  }

  async updateConstraints(input: UpdateTrainingConstraintsRequest) {
    return this.useCaseFactory.getUpdateTrainingConstraintsUseCase().execute(input);
  }
}
