import { RpcTarget } from 'cloudflare:workers';
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  ActivatePlanRequest,
  GeneratePlanFromGoalsRequest,
  AdjustPlanBasedOnFeedbackRequest,
  PausePlanRequest,
  GetCurrentPlanRequest,
} from '@bene/training-application';

export class PlanningFacade extends RpcTarget {
  constructor(private useCaseFactory: UseCaseFactory) {
    super();
  }

  async activate(input: ActivatePlanRequest) {
    const result = await this.useCaseFactory.getActivatePlanUseCase().execute(input)
    return result.serialize();
  }

  async generateFromGoals(input: GeneratePlanFromGoalsRequest) {
    const result = await this.useCaseFactory.getGeneratePlanFromGoalsUseCase().execute(input)
    return result.serialize();

  }

  async adjust(input: AdjustPlanBasedOnFeedbackRequest) {
    const result = await this.useCaseFactory.getAdjustPlanBasedOnFeedbackUseCase().execute(input)
    return result.serialize();

  }

  async pause(input: PausePlanRequest) {
    const result = await this.useCaseFactory.getPausePlanUseCase().execute(input)
    return result.serialize();

  }

  async getCurrentPlan(input: GetCurrentPlanRequest) {
    const result = await this.useCaseFactory.getGetCurrentPlanUseCase().execute(input)
    return result.serialize();

  }
}
