import { Result, Guard } from '@bene/domain-shared';
import { CoachingMessage } from './coaching-message.types.js';
import { CoachAction } from '../index.js';

export function createUserMessage(
  content: string,
  checkInId?: string,
): Result<CoachingMessage> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(content, 'content'),
    content ? Guard.againstTooLong(content, 2000, 'content') : Result.ok(),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    id: crypto.randomUUID(),
    role: 'user',
    content,
    checkInId,
    timestamp: new Date(),
  });
}

export function createCoachMessage(
  content: string,
  actions?: CoachAction[],
  checkInId?: string,
  tokens?: number,
): Result<CoachingMessage> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(content, 'content'),
    content ? Guard.againstTooLong(content, 2000, 'content') : Result.ok(),
    tokens !== undefined ? Guard.againstNegative(tokens, 'tokens') : Result.ok(),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    id: crypto.randomUUID(),
    role: 'coach',
    content,
    actions,
    checkInId,
    timestamp: new Date(),
    tokens,
  });
}

export function createSystemMessage(content: string): Result<CoachingMessage> {
  const guardResult = Guard.againstEmptyString(content, 'content');

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    id: crypto.randomUUID(),
    role: 'system',
    content,
    timestamp: new Date(),
  });
}
