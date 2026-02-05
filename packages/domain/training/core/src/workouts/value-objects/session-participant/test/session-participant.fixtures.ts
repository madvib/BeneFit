import { faker } from '@faker-js/faker';
import { Unbrand } from '@bene/shared';
import {
  SessionParticipant,
  ParticipantRole,
  ParticipantStatus,
} from '../session-participant.types.js';
import { sessionParticipantFromPersistence } from '../session-participant.factory.js';

/**
 * ============================================================================
 * SESSION PARTICIPANT FIXTURES (Canonical Pattern)
 * ============================================================================
 * 
 * Uses rehydration factory + realistic faker data.
 */

// ============================================================================
// HELPER
// ============================================================================

function createFixture(data: Unbrand<SessionParticipant>): SessionParticipant {
  const result = sessionParticipantFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create SessionParticipant fixture: ${ result.error }`);
  }

  return result.value;
}

// ============================================================================
// FIXTURES BY ROLE
// ============================================================================

export function createOwnerParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'owner',
    status: 'active',
    joinedAt: faker.date.recent({ days: 1 }),
    completedActivities: faker.number.int({ min: 0, max: 10 }),
    currentActivity: faker.helpers.maybe(() => faker.lorem.words(2)),
    leftAt: undefined,
    ...overrides,
  });
}

export function createActiveParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'participant',
    status: 'active',
    joinedAt: faker.date.recent({ days: 1 }),
    completedActivities: faker.number.int({ min: 0, max: 10 }),
    currentActivity: faker.helpers.maybe(() => faker.lorem.words(2)),
    leftAt: undefined,
    ...overrides,
  });
}

export function createSpectatorParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'spectator',
    status: 'active',
    joinedAt: faker.date.recent({ days: 1 }),
    completedActivities: 0, // Spectators don't complete activities
    currentActivity: undefined,
    leftAt: undefined,
    ...overrides,
  });
}

// ============================================================================
// FIXTURES BY STATUS
// ============================================================================

export function createCompletedParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  const joinedAt = faker.date.recent({ days: 1 });

  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'participant',
    status: 'completed',
    joinedAt,
    completedActivities: faker.number.int({ min: 5, max: 10 }),
    currentActivity: undefined,
    leftAt: undefined,
    ...overrides,
  });
}

export function createLeftParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  const joinedAt = faker.date.recent({ days: 1 });
  const leftAt = new Date(joinedAt.getTime() + faker.number.int({ min: 5, max: 30 }) * 60 * 1000);

  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'participant',
    status: 'left',
    joinedAt,
    completedActivities: faker.number.int({ min: 0, max: 5 }),
    currentActivity: undefined,
    leftAt,
    ...overrides,
  });
}

export function createPausedParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'participant',
    status: 'paused',
    joinedAt: faker.date.recent({ days: 1 }),
    completedActivities: faker.number.int({ min: 1, max: 5 }),
    currentActivity: faker.lorem.words(2),
    leftAt: undefined,
    ...overrides,
  });
}

// ============================================================================
// GENERIC (RANDOM)
// ============================================================================

/**
 * Creates a random SessionParticipant with any role/status.
 * Useful for variety in tests.
 */
export function createSessionParticipantFixture(
  overrides?: Partial<SessionParticipant>
): SessionParticipant {
  const roles: ParticipantRole[] = ['owner', 'participant', 'spectator'];
  const statuses: ParticipantStatus[] = ['active', 'paused', 'completed', 'left'];

  const role = faker.helpers.arrayElement(roles);
  const status = faker.helpers.arrayElement(statuses);
  const joinedAt = faker.date.recent({ days: 1 });

  // Logical defaults based on status
  const leftAt = status === 'left'
    ? new Date(joinedAt.getTime() + faker.number.int({ min: 5, max: 60 }) * 60 * 1000)
    : undefined;

  const currentActivity = status === 'active' || status === 'paused'
    ? faker.helpers.maybe(() => faker.lorem.words(2))
    : undefined;

  const completedActivities = role === 'spectator'
    ? 0
    : status === 'completed'
      ? faker.number.int({ min: 5, max: 10 })
      : faker.number.int({ min: 0, max: 5 });

  return createFixture({
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role,
    status,
    joinedAt,
    completedActivities,
    currentActivity,
    leftAt,
    ...overrides,
  });
}
