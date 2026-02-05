import { RpcTarget } from 'cloudflare:workers';
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  SendMessageToCoachRequest,
  DismissCheckInRequest,
  GenerateWeeklySummaryRequest,
  RespondToCheckInRequest,
  TriggerProactiveCheckInRequest,
  GetCoachHistoryRequest,
} from '@bene/coach-domain';

export class CoachFacade extends RpcTarget {
  constructor(private useCaseFactory: UseCaseFactory) {
    super();
  }

  async sendMessage(input: SendMessageToCoachRequest) {
    const result = await this.useCaseFactory.getSendMessageToCoachUseCase().execute(input);
    return result.serialize();

  }

  async dismissCheckIn(input: DismissCheckInRequest) {
    const result = await this.useCaseFactory.getDismissCheckInUseCase().execute(input);
    return result.serialize();
  }

  async generateWeeklySummary(input: GenerateWeeklySummaryRequest) {
    const result = await this.useCaseFactory.getGenerateWeeklySummaryUseCase().execute(input);
    return result.serialize();

  }

  async respondToCheckIn(input: RespondToCheckInRequest) {
    const result = await this.useCaseFactory.getRespondToCheckInUseCase().execute(input);
    return result.serialize();
  }

  async triggerProactiveCheckIn(input: TriggerProactiveCheckInRequest) {
    const result = await this.useCaseFactory.getTriggerProactiveCheckInUseCase().execute(input);
    return result.serialize();
  }

  async getHistory(input: GetCoachHistoryRequest) {
    const result = await this.useCaseFactory.getGetCoachHistoryUseCase().execute(input);
    return result.serialize();
  }
}
