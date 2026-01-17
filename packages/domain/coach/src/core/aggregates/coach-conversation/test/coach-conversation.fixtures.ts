import { faker } from '@faker-js/faker';
import { CoachConversation } from '../coach-conversation.types.js';
import { createCoachContextFixture } from '../../../value-objects/coach-context/test/coach-context.fixtures.js';
import { createCoachMsgFixture } from '../../../value-objects/coach-msg/test/coach-msg.fixtures.js';
import { createCheckInFixture } from '../../../value-objects/check-in/test/check-in.fixtures.js';

export function createCoachConversationFixture(
  overrides?: Partial<CoachConversation>
): CoachConversation {
  const messages = faker.helpers.multiple(() => createCoachMsgFixture(), {
    count: { min: 5, max: 20 },
  });
  const checkIns = faker.helpers.multiple(() => createCheckInFixture(), {
    count: { min: 1, max: 5 },
  });

  const userMessages = messages.filter((m) => m.role === 'user');
  const coachMessages = messages.filter((m) => m.role === 'coach');
  const pendingCheckIns = checkIns.filter((c) => c.status === 'pending');

  const startedAt = faker.date.past({ years: 0.5 });
  const lastMessageAt = faker.date.recent({ days: 7 });
  const lastContextUpdateAt = faker.date.recent({ days: 3 });

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    context: createCoachContextFixture(),
    messages,
    checkIns,
    totalMessages: messages.length,
    totalUserMessages: userMessages.length,
    totalCoachMessages: coachMessages.length,
    totalCheckIns: checkIns.length,
    pendingCheckIns: pendingCheckIns.length,
    startedAt,
    lastMessageAt,
    lastContextUpdateAt,
    ...overrides,
  };
}
