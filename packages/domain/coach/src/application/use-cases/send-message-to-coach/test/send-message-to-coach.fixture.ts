import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import { createCoachActionFixture } from '../../../../fixtures.js';
import {
  toCoachActionView
} from '@core/index.js';
import type { SendMessageToCoachResponse } from '../send-message-to-coach.js';

export type SendMessageToCoachFixtureOptions = BaseFixtureOptions<SendMessageToCoachResponse>;

/**
 * Build SendMessageToCoachResponse fixture
 */
export function buildSendMessageToCoachResponse(
  options: SendMessageToCoachFixtureOptions = {}
): Result<SendMessageToCoachResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to send message to coach');
  if (errorResult) return errorResult;

  const action = createCoachActionFixture({
    type: 'adjusted_plan',
    details: 'Added recovery session on Wednesday'
  });

  const response: SendMessageToCoachResponse = {
    conversationId: faker.string.uuid(),
    coachResponse: faker.lorem.paragraph(),
    actions: [toCoachActionView(action)],
    suggestedFollowUps: [
      "How should I prepare?",
      "Can we make it easier?",
      "Thanks, coach!"
    ]
  };

  return Result.ok({
    ...response,
    ...overrides,
  });
}
