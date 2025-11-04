import { Plan } from '@bene/core/activities';
import { Repository } from '@bene/core/shared';

// Repository for Plan domain entity
export interface PlanRepository extends Repository<Plan> {
  getCurrentPlan(): Promise<Plan | null>;
  getPlanSuggestions(): Promise<Plan[]>;
}
