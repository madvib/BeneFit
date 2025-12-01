import { Guard, Result } from '@bene/domain-shared';
import { FeedItemType, SessionFeedItem } from './session-feed-item.types.js';
import { randomUUID } from 'crypto';

export function createFeedItem(props: {
  type: FeedItemType;
  userId: string;
  userName: string;
  content: string;
  metadata?: Record<string, unknown>;
}): Result<SessionFeedItem> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.type, argumentName: 'type' },
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.userName, argumentName: 'userName' },
      { argument: props.content, argumentName: 'content' },
    ]),

    Guard.againstEmptyString(props.userId, 'userId'),
    Guard.againstEmptyString(props.userName, 'userName'),
    Guard.againstEmptyString(props.content, 'content'),
    Guard.againstTooLong(props.content, 500, 'content'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    id: randomUUID(),
    type: props.type,
    userId: props.userId,
    userName: props.userName,
    content: props.content,
    timestamp: new Date(),
    metadata: props.metadata,
  });
}
