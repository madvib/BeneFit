import { Guard, Result } from '@shared';
import { Reaction, ReactionType } from './reaction.types.js';

export function createReaction(props: {
  userId: string;
  userName: string;
  type: ReactionType;
}): Result<Reaction> {
  const guards = [
    Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.userName, argumentName: 'userName' },
      { argument: props.type, argumentName: 'type' },
    ]),
    Guard.againstEmptyString(props.userId, 'userId'),
    Guard.againstEmptyString(props.userName, 'userName'),
  ];
  const guardResult = Guard.combine(guards);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    id: crypto.randomUUID(),
    userId: props.userId,
    userName: props.userName,
    type: props.type,
    createdAt: new Date(),
  });
}
