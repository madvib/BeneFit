import { UseCaseFactory } from '../factories/use-case-factory';
import { CoachFeature } from '../features/coach/coach.feature';
import {
  SendMessageToCoachRequest,
  DismissCheckInRequest,
  GenerateWeeklySummaryRequest,
  RespondToCheckInRequest,
  TriggerProactiveCheckInRequest
} from '@bene/coach-domain';

export class CoachFacade extends CoachFeature {
  constructor(
    state: DurableObjectState,
    useCaseFactory: UseCaseFactory
  ) {
    super(state, useCaseFactory);
  }

  async sendMessage(input: SendMessageToCoachRequest) {
    // Delegate to feature logic which now uses UseCaseFactory properly (will be updated)
    // Or override here.
    // The previous CoachFeature had a `sendMessage` method.
    return super.sendMessage(input);
  }

  async dismissCheckIn(input: DismissCheckInRequest) {
    return this.useCaseFactory.getDismissCheckInUseCase().execute(input);
  }

  async generateWeeklySummary(input: GenerateWeeklySummaryRequest) {
    return this.useCaseFactory.getGenerateWeeklySummaryUseCase().execute(input);
  }

  async respondToCheckIn(input: RespondToCheckInRequest) {
    return this.useCaseFactory.getRespondToCheckInUseCase().execute(input);
  }

  async triggerProactiveCheckIn(input: TriggerProactiveCheckInRequest) {
    return this.useCaseFactory.getTriggerProactiveCheckInUseCase().execute(input);
  }
}
