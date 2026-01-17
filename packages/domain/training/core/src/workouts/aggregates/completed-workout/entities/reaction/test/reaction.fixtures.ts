import { Reaction, ReactionType } from '../reaction.types.js';
import { createReaction } from '../reaction.factory.js';

/**
 * Canonical Fixtures for Reaction
 */

export function createFireReactionFixture(overrides?: Partial<Reaction>): Reaction {
  const result = createReaction({
    userId: 'user-123',
    userName: 'John Doe',
    type: 'fire',
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createStrongReactionFixture(overrides?: Partial<Reaction>): Reaction {
  const result = createReaction({
    userId: 'user-456',
    userName: 'Jane Smith',
    type: 'strong',
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createReactionOfTypeFixture(type: ReactionType, overrides?: Partial<Reaction>): Reaction {
  const result = createReaction({
    userId: 'user-789',
    userName: 'Test User',
    type,
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createReactionListFixture(count: number): Reaction[] {
  const types: ReactionType[] = ['fire', 'strong', 'clap', 'heart', 'smile'];
  return Array.from({ length: count }, (_, i) =>
    createReactionOfTypeFixture(types[i % types.length]!, {
      userName: `User ${ i + 1 }`,
    })
  );
}
