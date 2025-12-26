import { RpcTarget } from 'cloudflare:workers';
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  GetProfileRequest,
  CreateUserProfileRequest,
  UpdateFitnessGoalsRequest,
  UpdatePreferencesRequest,
  GetUserStatsRequest,
  UpdateTrainingConstraintsRequest
} from '@bene/training-application';

export class ProfileFacade extends RpcTarget {
  constructor(private useCaseFactory: UseCaseFactory) {
    super();
  }

  async get(input: GetProfileRequest) {
    const result = await this.useCaseFactory.getGetProfileUseCase().execute(input);
    return result.serialize();

  }

  async create(input: CreateUserProfileRequest) {
    const result = await this.useCaseFactory.getCreateUserProfileUseCase().execute(input);
    return result.serialize();

  }

  async updateGoals(input: UpdateFitnessGoalsRequest) {
    const result = await this.useCaseFactory.getUpdateFitnessGoalsUseCase().execute(input);
    return result.serialize();

  }

  async updatePreferences(input: UpdatePreferencesRequest) {
    const result = await this.useCaseFactory.getUpdatePreferencesUseCase().execute(input);
    return result.serialize();

  }

  async getStats(input: GetUserStatsRequest) {
    const result = await this.useCaseFactory.getGetUserStatsUseCase().execute(input);
    return result.serialize();

  }

  async updateConstraints(input: UpdateTrainingConstraintsRequest) {
    const result = await this.useCaseFactory.getUpdateTrainingConstraintsUseCase().execute(input);
    return result.serialize();

  }
}
