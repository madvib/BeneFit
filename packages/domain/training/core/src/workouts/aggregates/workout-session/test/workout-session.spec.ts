
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import {
  createSessionConfigurationFixture,
  createSessionParticipantFixture,
  createWorkoutActivityFixture,
  createWorkoutSessionInputFixture,
  createWorkoutSessionFixture
} from '@/fixtures.js';
import {
  startSession,
  joinSession,
  pauseSession,
  resumeSession,
  completeActivity,
  abandonSession
} from '../workout-session.commands.js';
import {
  getCurrentActivity,
  getCompletionPercentage,
  getActiveParticipants,
  isParticipantInSession,
  canJoin
} from '../workout-session.queries.js';
import { CreateWorkoutSessionSchema } from '../workout-session.factory.js';

describe('WorkoutSession', () => {
  describe('Factory', () => {
    it('should create a valid workout session', () => {
      const input = createWorkoutSessionInputFixture();
      const result = CreateWorkoutSessionSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ownerId).toBe(input.ownerId);
        expect(result.data.workoutType).toBe(input.workoutType);
        expect(result.data.state).toBe('preparing');
        expect(result.data.id).toBeDefined();
      }
    });

    it('should create multiplayer session', () => {
      const input = createWorkoutSessionInputFixture({ isMultiplayer: true });
      const result = CreateWorkoutSessionSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.configuration.isMultiplayer).toBe(true);
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const session = createWorkoutSessionFixture();
      expect(session.id).toBeDefined();
      expect(session.state).toBeDefined();
    });

    it('should allow fixture overrides', () => {
      const session = createWorkoutSessionFixture({ state: 'completed' });
      expect(session.state).toBe('completed');
    });
  });

  describe('Commands', () => {
    it('should start a session', () => {
      const session = createWorkoutSessionFixture({ state: 'preparing', participants: [] });
      const ownerName = 'Test Owner';

      const result = startSession(session, ownerName);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('in_progress');
        expect(result.value.participants.length).toBe(1);
        expect(result.value.startedAt).toBeDefined();
      }
    });

    it('should pause a session', () => {
      const session = createWorkoutSessionFixture({ state: 'in_progress' });
      const result = pauseSession(session);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('paused');
        expect(result.value.pausedAt).toBeDefined();
      }
    });

    it('should resume a paused session', () => {
      const session = createWorkoutSessionFixture({ state: 'paused', pausedAt: faker.date.recent() });
      const result = resumeSession(session);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('in_progress');
        expect(result.value.resumedAt).toBeDefined();
      }
    });

    it('should complete an activity', () => {
      const activity = createWorkoutActivityFixture({ type: 'main', order: 0 });
      const session = createWorkoutSessionFixture({
        state: 'in_progress',
        activities: [activity],
        currentActivityIndex: 0
      });

      const activityPerformance = {
        activityType: 'main' as const,
        completed: true,
        durationMinutes: 30,
      };

      const result = completeActivity(session, activityPerformance);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.completedActivities.length).toBe(1);
        // If it was the only activity, it might complete the session
        expect(result.value.state).toBe('completed');
      }
    });

    it('should abandon a session', () => {
      const session = createWorkoutSessionFixture({ state: 'in_progress' });
      const reason = 'Test abandonment reason';
      const result = abandonSession(session, reason);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('abandoned');
        expect(result.value.abandonedAt).toBeDefined();
      }
    });

    it('should allow joining multiplayer session', () => {
      const session = createWorkoutSessionFixture({
        configuration: createSessionConfigurationFixture({ isMultiplayer: true }),
        state: 'in_progress'
      });

      const userId = randomUUID();
      const userName = 'Test Participant';
      const result = joinSession(session, userId, userName);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.participants.length).toBeGreaterThan(1);
        expect(isParticipantInSession(result.value, userId)).toBe(true);
      }
    });
  });

  describe('Queries', () => {
    it('should get current activity', () => {
      const activity = createWorkoutActivityFixture({ order: 0 });
      const session = createWorkoutSessionFixture({ activities: [activity], currentActivityIndex: 0 });

      const current = getCurrentActivity(session);
      expect(current).toEqual(activity);
    });

    it('should calculate completion percentage', () => {
      const activities = [
        createWorkoutActivityFixture({ order: 0 }),
        createWorkoutActivityFixture({ order: 1 })
      ];
      // Create session with 1 completed activity
      const session = createWorkoutSessionFixture({ activities, currentActivityIndex: 0, state: 'in_progress' });

      const activityPerformance = {
        activityType: 'main' as const,
        completed: true,
        durationMinutes: 10,
      };

      const result = completeActivity(session, activityPerformance);
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(getCompletionPercentage(result.value)).toBe(50);
      }
    });

    it('should get active participants', () => {
      const session = createWorkoutSessionFixture({
        participants: [
          createSessionParticipantFixture({ userId: 'u1', role: 'owner', status: 'active' }),
          createSessionParticipantFixture({ userId: 'u2', role: 'participant', status: 'active' })
        ]
      });

      const active = getActiveParticipants(session);
      expect(active.length).toBe(2);
    });

    it('should check if participant is in session', () => {
      const userId = randomUUID();
      const session = createWorkoutSessionFixture({
        participants: [createSessionParticipantFixture({ userId, role: 'owner', status: 'active' })]
      });

      expect(isParticipantInSession(session, userId)).toBe(true);
      expect(isParticipantInSession(session, randomUUID())).toBe(false);
    });

    it('should check if session can be joined', () => {
      const session = createWorkoutSessionFixture({
        configuration: createSessionConfigurationFixture({ isMultiplayer: true }),
        state: 'in_progress'
      });
      expect(canJoin(session)).toBe(true);

      const abandonedSession = createWorkoutSessionFixture({
        configuration: createSessionConfigurationFixture({ isMultiplayer: true }),
        state: 'abandoned'
      });
      expect(canJoin(abandonedSession)).toBe(false);
    });
  });
});
