import { faker } from '@faker-js/faker';
import { createCoachActionFixture } from '../../../../fixtures.js';
import {
  toCoachActionView
} from '@core/index.js';
import type { SendMessageToCoachResponse } from '../send-message-to-coach.js';

/**
 * Build SendMessageToCoachResponse fixture
 */
export function buildSendMessageToCoachResponse(
  overrides?: Partial<SendMessageToCoachResponse>
): SendMessageToCoachResponse {
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

  return {
    ...response,
    ...overrides,
  };
}
