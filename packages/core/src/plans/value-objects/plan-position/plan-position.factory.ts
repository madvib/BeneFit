import { Result, Guard } from '@shared';
import { PlanPosition } from './plan-position.types.js';

export interface PlanPositionProps {
  readonly week: number;
  readonly day: number; // 0-6 (Sunday-Saturday)
}

export function createPlanPosition(props: PlanPositionProps): Result<PlanPosition> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefined(props.week, 'week'),
    Guard.againstNullOrUndefined(props.day, 'day'),
    Guard.inRange(props.week, 1, 1000, 'week'),
    Guard.inRange(props.day, 0, 6, 'day'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok(props);
}

export function createPlanPositionAtStart(): PlanPosition {
  return { week: 1, day: 0 };
}