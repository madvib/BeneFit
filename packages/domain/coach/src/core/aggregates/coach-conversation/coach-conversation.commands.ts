import { Result, Guard } from '@bene/shared';
import { CoachConversation } from './coach-conversation.types.js';
import { CheckInError } from '../../errors/index.js';
import {
  CheckIn,
  CoachAction,
  CoachContext,
  createCoachMessage,
  createSystemMessage,
  createUserMessage,
} from '../../value-objects/index.js';

export function addUserMessage(
  conversation: CoachConversation,
  content: string,
  checkInId?: string,
): Result<CoachConversation> {
  const messageResult = createUserMessage({ content, checkInId });
  if (messageResult.isFailure) {
    return Result.fail(messageResult.error);
  }

  const now = new Date();
  return Result.ok({
    ...conversation,
    messages: [...conversation.messages, messageResult.value],
    totalMessages: conversation.totalMessages + 1,
    totalUserMessages: conversation.totalUserMessages + 1,
    lastMessageAt: now,
  });
}

export function addCoachMessage(
  conversation: CoachConversation,
  content: string,
  actions?: CoachAction[],
  checkInId?: string,
  tokens?: number,
): Result<CoachConversation> {
  const messageResult = createCoachMessage({ content, actions, checkInId, tokens });
  if (messageResult.isFailure) {
    return Result.fail(messageResult.error);
  }

  const now = new Date();
  return Result.ok({
    ...conversation,
    messages: [...conversation.messages, messageResult.value],
    totalMessages: conversation.totalMessages + 1,
    totalCoachMessages: conversation.totalCoachMessages + 1,
    lastMessageAt: now,
  });
}

export function addSystemMessage(
  conversation: CoachConversation,
  content: string,
): Result<CoachConversation> {
  const messageResult = createSystemMessage({ content });
  if (messageResult.isFailure) {
    return Result.fail(messageResult.error);
  }

  return Result.ok({
    ...conversation,
    messages: [...conversation.messages, messageResult.value],
    totalMessages: conversation.totalMessages + 1,
    lastMessageAt: new Date(),
  });
}

export function scheduleCheckIn(
  conversation: CoachConversation,
  checkIn: CheckIn,
): Result<CoachConversation> {
  const guardResult = Guard.againstNullOrUndefined(checkIn, 'checkIn');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...conversation,
    checkIns: [...conversation.checkIns, checkIn],
    totalCheckIns: conversation.totalCheckIns + 1,
    pendingCheckIns: conversation.pendingCheckIns + 1,
  });
}

export function respondToCheckIn(
  conversation: CoachConversation,
  checkInId: string,
  userResponse: string,
  coachAnalysis: string,
  actions: CoachAction[],
): Result<CoachConversation> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: checkInId, argumentName: 'checkInId' },
      { argument: userResponse, argumentName: 'userResponse' },
      { argument: coachAnalysis, argumentName: 'coachAnalysis' },
    ]),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const checkInIndex = conversation.checkIns.findIndex((c) => c.id === checkInId);
  if (checkInIndex < 0) {
    return Result.fail(new CheckInError(`Check-in ${checkInId} not found`));
  }

  const checkIn = conversation.checkIns[checkInIndex];
  if (!checkIn) {
    return Result.fail(new CheckInError(`Check-in ${checkInId} not found`));
  }

  if (checkIn.status !== 'pending') {
    return Result.fail(new CheckInError('Check-in is not pending'));
  }

  const now = new Date();
  const updatedCheckIn: CheckIn = {
    ...checkIn,
    userResponse,
    coachAnalysis,
    actions,
    status: 'responded',
    respondedAt: now,
  };

  const updatedCheckIns = [...conversation.checkIns];
  updatedCheckIns[checkInIndex] = updatedCheckIn;

  return Result.ok({
    ...conversation,
    checkIns: updatedCheckIns,
    pendingCheckIns: conversation.pendingCheckIns - 1,
  });
}

export function dismissCheckIn(
  conversation: CoachConversation,
  checkInId: string,
): Result<CoachConversation> {
  const guardResult = Guard.againstEmptyString(checkInId, 'checkInId');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const checkInIndex = conversation.checkIns.findIndex((c) => c.id === checkInId);
  if (checkInIndex < 0) {
    return Result.fail(new CheckInError(`Check-in ${checkInId} not found`));
  }

  const checkIn = conversation.checkIns[checkInIndex];
  if (!checkIn) {
    return Result.fail(new CheckInError(`Check-in ${checkInId} not found`));
  }

  if (checkIn.status !== 'pending') {
    return Result.fail(new CheckInError('Check-in is not pending'));
  }

  const updatedCheckIn: CheckIn = {
    ...checkIn,
    status: 'dismissed',
    dismissedAt: new Date(),
  };

  const updatedCheckIns = [...conversation.checkIns];
  updatedCheckIns[checkInIndex] = updatedCheckIn;

  return Result.ok({
    ...conversation,
    checkIns: updatedCheckIns,
    pendingCheckIns: conversation.pendingCheckIns - 1,
  });
}

export function updateContext(
  conversation: CoachConversation,
  context: CoachContext,
): Result<CoachConversation> {
  const guardResult = Guard.againstNullOrUndefined(context, 'context');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...conversation,
    context,
    lastContextUpdateAt: new Date(),
  });
}

export function clearOldMessages(
  conversation: CoachConversation,
  keepLastN: number = 50,
): Result<CoachConversation> {
  const guardResult = Guard.againstNegativeOrZero(keepLastN, 'keepLastN');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  if (conversation.messages.length <= keepLastN) {
    return Result.ok(conversation);
  }

  const messages = conversation.messages.slice(-keepLastN);
  return Result.ok({
    ...conversation,
    messages,
  });
}
