import { faker } from '@faker-js/faker';
import { SessionFeedItem, FeedItemType } from '../session-feed-item.types.js';
import { createFeedItem } from '../session-feed-item.factory.js';

/**
 * Creates a mock SessionFeedItem using the official factory
 */
export function createSessionFeedItemFixture(overrides?: Partial<SessionFeedItem>): SessionFeedItem {
  const result = createFeedItem({
    type: faker.helpers.arrayElement(['user_joined', 'user_left', 'activity_completed', 'set_completed', 'milestone_achieved', 'encouragement', 'chat_message'] as FeedItemType[]),
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    content: faker.lorem.sentence().substring(0, 500),
    metadata: {},
  });

  if (result.isFailure) {
    throw new Error(`Failed to create SessionFeedItem fixture: ${ result.error }`);
  }

  return {
    ...result.value,
    ...overrides
  };
}
