
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  GetTodaysWorkoutRequest,
  GetUpcomingWorkoutsRequest,
  GetWorkoutHistoryRequest,
  SkipWorkoutRequest
} from '@bene/training-application';

export class WorkoutsFacade {
  constructor(private useCaseFactory: UseCaseFactory) { }


  async getTodaysWorkout(input: GetTodaysWorkoutRequest) {
    return this.useCaseFactory.getGetTodaysWorkoutUseCase().execute(input);
  }

  async getUpcoming(input: GetUpcomingWorkoutsRequest) {
    return this.useCaseFactory.getGetUpcomingWorkoutsUseCase().execute(input);
  }

  async getHistory(input: GetWorkoutHistoryRequest) {
    return this.useCaseFactory.getGetWorkoutHistoryUseCase().execute(input);
  }

  async skip(input: SkipWorkoutRequest) {
    return this.useCaseFactory.getSkipWorkoutUseCase().execute(input);
  }
}
