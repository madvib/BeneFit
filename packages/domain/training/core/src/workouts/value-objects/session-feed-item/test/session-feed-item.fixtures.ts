import { faker } from '@faker-js/faker';
import { SessionFeedItem, FeedItemType } from '../session-feed-item.types.js';
import { sessionFeedItemFromPersistence } from '../session-feed-item.factory.js';

/**
 * Creates a mock SessionFeedItem using sessionFeedItemFromPersistence.
 */
export function createSessionFeedItemFixture(overrides?: Partial<SessionFeedItem>): SessionFeedItem {
  // Build unbranded data with faker
  const data = {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['user_joined', 'user_left', 'activity_completed', 'set_completed', 'milestone_achieved', 'encouragement', 'chat_message'] as FeedItemType[]),
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    content: faker.lorem.sentence().substring(0, 500),
    timestamp: faker.date.recent(),
    metadata: {},
    ...overrides,
  };

  // Rehydrate through fromPersistence
  const result = sessionFeedItemFromPersistence(data);

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create SessionFeedItem fixture: ${ errorMsg }`);
  }

  return result.value;
}
