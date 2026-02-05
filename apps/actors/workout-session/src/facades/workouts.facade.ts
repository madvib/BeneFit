import { RpcTarget } from 'cloudflare:workers';
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  StartWorkoutRequest,
  CompleteWorkoutRequest,
  JoinMultiplayerWorkoutRequest,
  AddWorkoutReactionRequest,
} from '@bene/training-application';

export class WorkoutsFacade extends RpcTarget {
  constructor(private useCaseFactory: UseCaseFactory) {
    super();
  }

  async start(input: StartWorkoutRequest) {
    const result = await this.useCaseFactory.getStartWorkoutUseCase().execute(input);
    return result.serialize();
  }

  async complete(input: CompleteWorkoutRequest) {
    const result = await this.useCaseFactory.getCompleteWorkoutUseCase().execute(input);
    return result.serialize();
  }

  async joinMultiplayer(input: JoinMultiplayerWorkoutRequest) {
    const result = await this.useCaseFactory.getJoinMultiplayerWorkoutUseCase().execute(input);
    return result.serialize();
  }

  async addReaction(input: AddWorkoutReactionRequest) {
    const result = await this.useCaseFactory.getAddWorkoutReactionUseCase().execute(input);
    return result.serialize();
  }
}
