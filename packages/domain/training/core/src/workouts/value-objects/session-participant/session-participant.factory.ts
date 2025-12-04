import { Guard, Result } from '@bene/shared-domain';
import { ParticipantRole, SessionParticipant } from './session-participant.types.js';

export function createSessionParticipant(props: {
  userId: string;
  userName: string;
  avatar?: string;
  role: ParticipantRole;
}): Result<SessionParticipant> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.userName, argumentName: 'userName' },
      { argument: props.role, argumentName: 'role' },
    ]),

    Guard.againstEmptyString(props.userId, 'userId'),
    Guard.againstEmptyString(props.userName, 'userName'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    userId: props.userId,
    userName: props.userName,
    avatar: props.avatar,
    role: props.role,
    status: 'active',
    joinedAt: new Date(),
    completedActivities: 0,
  });
}
