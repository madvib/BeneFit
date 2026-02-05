import { faker } from '@faker-js/faker';
import {
  createCoachContextFixture,
  createCoachMsgFixture,
  createCheckInFixture
} from '@/fixtures.js';
import { CoachConversation } from '../coach-conversation.types.js';
import { coachConversationFromPersistence } from '../coach-conversation.factory.js';

/**
 * Creates a CoachConversation fixture for testing.
 * Uses coachConversationFromPersistence to ensure branding and type safety.
 */
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

  const data = {
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

  // Recalculate stats if messages or checkIns were overridden
  if (overrides?.messages) {
    data.totalMessages = overrides.messages.length;
    data.totalUserMessages = overrides.messages.filter(m => m.role === 'user').length;
    data.totalCoachMessages = overrides.messages.filter(m => m.role === 'coach').length;
  }
  if (overrides?.checkIns) {
    data.totalCheckIns = overrides.checkIns.length;
    data.pendingCheckIns = overrides.checkIns.filter(c => c.status === 'pending').length;
  }

  const result = coachConversationFromPersistence(data as CoachConversation);

  if (result.isFailure) {
    throw new Error(`Failed to create CoachConversation fixture: ${ result.errorMessage }`);
  }

  return result.value;
}
