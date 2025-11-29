import { Result, Guard } from '@bene/domain-shared';
import { CheckInType, CheckInTrigger, CheckIn } from './check-in.types.js';

export function createCheckIn(props: {
  type: CheckInType;
  question: string;
  triggeredBy?: CheckInTrigger;
}): Result<CheckIn> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.type, argumentName: 'type' },
      { argument: props.question, argumentName: 'question' },
    ]),
    Guard.againstEmptyString(props.question, 'question'),
    props.question
      ? Guard.againstTooLong(props.question, 500, 'question')
      : Result.ok(),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    id: crypto.randomUUID(),
    type: props.type,
    triggeredBy: props.triggeredBy,
    question: props.question,
    actions: [],
    status: 'pending',
    createdAt: new Date(),
  });
}
