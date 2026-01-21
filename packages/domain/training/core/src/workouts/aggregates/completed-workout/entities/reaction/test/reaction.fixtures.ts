import { faker } from '@faker-js/faker';
import { Reaction, ReactionType } from '../reaction.types.js';
import { reactionFromPersistence, CreateReactionSchema } from '../reaction.factory.js';
import { z } from 'zod';

type CreateReactionInput = z.input<typeof CreateReactionSchema>;

/**
 * Creates valid input for Reaction factory
 */
export function createReactionInputFixture(
  overrides?: Partial<CreateReactionInput>,
): CreateReactionInput {
  return {
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    type: faker.helpers.arrayElement(['fire', 'strong', 'clap', 'heart', 'smile'] as ReactionType[]),
    createdAt: new Date(),
    ...overrides,
  };
}

export function createReactionFixture(overrides?: Partial<Reaction>): Reaction {
  const defaultInput = createReactionInputFixture();
  const data = {
    ...defaultInput,
    id: faker.string.uuid(),
    ...overrides,
  };

  const result = reactionFromPersistence(data as Reaction);

  if (result.isFailure) {
    throw new Error(`Failed to create Reaction fixture: ${ result.error }`);
  }

  return result.value;
}

export function createFireReactionFixture(overrides?: Partial<Reaction>): Reaction {
  return createReactionFixture({
    type: 'fire',
    ...overrides,
  });
}

export function createStrongReactionFixture(overrides?: Partial<Reaction>): Reaction {
  return createReactionFixture({
    type: 'strong',
    ...overrides,
  });
}

export function createReactionOfTypeFixture(type: ReactionType, overrides?: Partial<Reaction>): Reaction {
  return createReactionFixture({
    type,
    ...overrides,
  });
}

export function createReactionListFixture(count: number): Reaction[] {
  const types: ReactionType[] = ['fire', 'strong', 'clap', 'heart', 'smile'];
  return Array.from({ length: count }, (_, i) =>
    createReactionOfTypeFixture(types[i % types.length]!, {
      userName: `User ${ i + 1 }`,
    })
  );
}
