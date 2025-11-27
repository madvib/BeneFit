import { Result, Guard } from '@shared';
import { createCoachingContext } from '../../value-objects/coaching-context/coaching-context.factory.js';
import { CoachingConversationData } from './coach-conversation.types.js';
import { CoachingContext } from '../../index.js';

export interface CreateCoachingConversationParams {
  userId: string;
  context?: CoachingContext;
  initialMessage?: string;
}

export function createCoachingConversation(
  params: CreateCoachingConversationParams,
): Result<CoachingConversationData> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(params.userId, 'userId'),
    Guard.againstNullOrUndefined(params.userId, 'userId'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const now = new Date();
  const initialContext = params.context || createCoachingContext({}).value;

  const conversation: CoachingConversationData = {
    id: crypto.randomUUID(),
    userId: params.userId,
    context: initialContext,
    messages: params.initialMessage ? [] : [], // Will be added separately
    checkIns: [],
    totalMessages: params.initialMessage ? 1 : 0,
    totalUserMessages: 0,
    totalCoachMessages: params.initialMessage ? 1 : 0,
    totalCheckIns: 0,
    pendingCheckIns: 0,
    startedAt: now,
    lastMessageAt: now,
    lastContextUpdateAt: now,
  };

  return Result.ok(conversation);
}
