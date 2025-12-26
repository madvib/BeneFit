import { RpcTarget } from 'cloudflare:workers';
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  GetTodaysWorkoutRequest,
  GetUpcomingWorkoutsRequest,
  GetWorkoutHistoryRequest,
  SkipWorkoutRequest
} from '@bene/training-application';

export class WorkoutsFacade extends RpcTarget {
  constructor(private useCaseFactory: UseCaseFactory) {
    super();
  }


  async getTodaysWorkout(input: GetTodaysWorkoutRequest) {
    const result = await this.useCaseFactory.getGetTodaysWorkoutUseCase().execute(input);
    return result.serialize();

  }

  async getUpcoming(input: GetUpcomingWorkoutsRequest) {
    const result = await this.useCaseFactory.getGetUpcomingWorkoutsUseCase().execute(input);
    return result.serialize();

  }

  async getHistory(input: GetWorkoutHistoryRequest) {
    const result = await this.useCaseFactory.getGetWorkoutHistoryUseCase().execute(input);
    return result.serialize();

  }

  async skip(input: SkipWorkoutRequest) {
    const result = await this.useCaseFactory.getSkipWorkoutUseCase().execute(input);
    return result.serialize();

  }
}
