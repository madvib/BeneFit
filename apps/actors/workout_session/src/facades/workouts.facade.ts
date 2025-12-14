
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  StartWorkoutRequest,
  CompleteWorkoutRequest,
  JoinMultiplayerWorkoutRequest,
  AddWorkoutReactionRequest,
  GetTodaysWorkoutRequest
} from '@bene/training-application';

export class WorkoutsFacade {
  constructor(private useCaseFactory: UseCaseFactory) { }

  async start(input: StartWorkoutRequest) {
    return this.useCaseFactory.getStartWorkoutUseCase().execute(input);
  }

  async complete(input: CompleteWorkoutRequest) {
    return this.useCaseFactory.getCompleteWorkoutUseCase().execute(input);
  }

  async joinMultiplayer(input: JoinMultiplayerWorkoutRequest) {
    return this.useCaseFactory.getJoinMultiplayerWorkoutUseCase().execute(input);
  }

  async addReaction(input: AddWorkoutReactionRequest) {
    return this.useCaseFactory.getAddWorkoutReactionUseCase().execute(input);
  }

  async getTodaysWorkout(input: GetTodaysWorkoutRequest) {
    // Kept here just in case, or for convenience, but UserHub is primary for this now.
    // The user moved implementation here in previous steps.
    return this.useCaseFactory.getGetTodaysWorkoutUseCase().execute(input);
  }
}
