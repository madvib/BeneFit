import { faker } from '@faker-js/faker';
import { WorkoutSession, SessionState } from '../workout-session.types.js';
import { createWorkoutActivityFixture, createSessionParticipantFixture, createSessionConfigurationFixture, createSessionFeedItemFixture } from '../../../value-objects/index.js';

export function createWorkoutSessionFixture(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: faker.string.uuid(),
    ownerId: faker.string.uuid(),
    planId: faker.string.uuid(),
    workoutTemplateId: faker.string.uuid(),
    workoutType: faker.helpers.arrayElement(['Strength', 'Cardio', 'HIIT']),
    activities: [
      createWorkoutActivityFixture({ name: 'Warmup', type: 'warmup', order: 0 }),
      createWorkoutActivityFixture({ name: 'Main Set', type: 'main', order: 1 }),
      createWorkoutActivityFixture({ name: 'Cooldown', type: 'cooldown', order: 2 })
    ],
    state: faker.helpers.arrayElement<SessionState>(['preparing', 'in_progress', 'paused', 'completed']),
    currentActivityIndex: 0,
    liveProgress: undefined,
    completedActivities: [],
    configuration: createSessionConfigurationFixture(),
    participants: [createSessionParticipantFixture({ role: 'owner' })],
    activityFeed: [createSessionFeedItemFixture()],
    startedAt: faker.date.recent(),
    pausedAt: undefined,
    resumedAt: undefined,
    completedAt: undefined,
    abandonedAt: undefined,
    totalPausedSeconds: 0,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides
  };
}
