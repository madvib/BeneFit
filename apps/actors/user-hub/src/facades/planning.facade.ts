
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  ActivatePlanRequest,
  GeneratePlanFromGoalsRequest,
  AdjustPlanRequest,
  PausePlanRequest
} from '@bene/training-application';

export class PlanningFacade {
  constructor(private useCaseFactory: UseCaseFactory) { }

  async activate(input: ActivatePlanRequest) {
    return this.useCaseFactory.getActivatePlanUseCase().execute(input);
  }

  async generateFromGoals(input: GeneratePlanFromGoalsRequest) {
    return this.useCaseFactory.getGeneratePlanFromGoalsUseCase().execute(input);
  }

  async adjust(input: AdjustPlanRequest) {
    return this.useCaseFactory.getAdjustPlanBasedOnFeedbackUseCase().execute(input);
  }

  async pause(input: PausePlanRequest) {
    return this.useCaseFactory.getPausePlanUseCase().execute(input);
  }
}
