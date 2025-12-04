import { Result, Guard } from '@bene/shared-domain';
import { CoachActionType, CoachAction } from './coach-action.types.js';

export function createCoachAction(props: {
  type: CoachActionType;
  details: string;
  planChangeId?: string;
}): Result<CoachAction> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.type, argumentName: 'type' },
      { argument: props.details, argumentName: 'details' },
    ]),
    Guard.againstEmptyString(props.details, 'details'),
    props.details ? Guard.againstTooLong(props.details, 500, 'details') : Result.ok(),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    type: props.type,
    details: props.details,
    appliedAt: new Date(),
    planChangeId: props.planChangeId,
  });
}
