import { describe, it, expect } from 'vitest';
import { createWorkoutSession } from '../workout-session.factory.js';
import { startSession, joinSession, pauseSession, resumeSession, completeActivity, abandonSession } from '../workout-session.commands.js';
import { getCurrentActivity, getCompletionPercentage, getActiveParticipants, isParticipantInSession, canJoin } from '../workout-session.queries.js';
import { WorkoutActivity } from '../../value-objects/workout-activity/workout-activity.types.js';

describe('WorkoutSession', () => {
  const validActivity: WorkoutActivity = {
    type: 'main',
    name: 'Strength Training',
    order: 1,
    duration: 30,
  };

  const validParams = {
    ownerId: 'user-123',
    workoutType: 'Strength',
    activities: [validActivity],
  };

  describe('factory', () => {
    it('should create a valid workout session', () => {
      const result = createWorkoutSession(validParams);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.ownerId).toBe('user-123');
        expect(result.value.workoutType).toBe('Strength');
        expect(result.value.state).toBe('preparing');
        expect(result.value.id).toBeDefined();
      }
    });

    it('should fail if activities array is empty', () => {
      const result = createWorkoutSession({
        ...validParams,
        activities: [],
      });

      expect(result.isFailure).toBe(true);
    });

    it('should create multiplayer session', () => {
      const result = createWorkoutSession({
        ...validParams,
        isMultiplayer: true,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.configuration.isMultiplayer).toBe(true);
      }
    });
  });

  describe('commands', () => {
    it('should start a session', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      const session = sessionResult.value;

      const result = startSession(session, 'John Doe');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('in_progress');
        expect(result.value.participants.length).toBe(1);
        expect(result.value.startedAt).toBeDefined();
      }
    });

    it('should pause a session', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;
      const result = pauseSession(session);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('paused');
        expect(result.value.pausedAt).toBeDefined();
      }
    });

    it('should resume a paused session', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;
      session = pauseSession(session).value;
      const result = resumeSession(session);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('in_progress');
        expect(result.value.resumedAt).toBeDefined();
      }
    });

    it('should complete an activity', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;

      const activityPerformance = {
        activityType: 'main' as const,
        completed: true,
        durationMinutes: 30,
      };

      const result = completeActivity(session, activityPerformance);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.completedActivities.length).toBe(1);
        expect(result.value.state).toBe('completed');
      }
    });

    it('should abandon a session', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;
      const result = abandonSession(session, 'Feeling tired');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.state).toBe('abandoned');
        expect(result.value.abandonedAt).toBeDefined();
      }
    });

    it('should allow joining multiplayer session', () => {
      const sessionResult = createWorkoutSession({
        ...validParams,
        isMultiplayer: true,
      });
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;
      const result = joinSession(session, 'user-456', 'Jane Doe');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.participants.length).toBe(2);
      }
    });
  });

  describe('queries', () => {
    it('should get current activity', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      const session = sessionResult.value;

      const current = getCurrentActivity(session);
      expect(current).toEqual(validActivity);
    });

    it('should calculate completion percentage', () => {
      const sessionResult = createWorkoutSession({
        ...validParams,
        activities: [validActivity, validActivity],
      });
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;

      const activityPerformance = {
        activityType: 'main' as const,
        completed: true,
        durationMinutes: 30,
      };

      session = completeActivity(session, activityPerformance).value;

      expect(getCompletionPercentage(session)).toBe(50);
    });

    it('should get active participants', () => {
      const sessionResult = createWorkoutSession({
        ...validParams,
        isMultiplayer: true,
      });
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;
      session = joinSession(session, 'user-456', 'Jane Doe').value;

      const active = getActiveParticipants(session);
      expect(active.length).toBe(2);
    });

    it('should check if participant is in session', () => {
      const sessionResult = createWorkoutSession(validParams);
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;

      expect(isParticipantInSession(session, 'user-123')).toBe(true);
      expect(isParticipantInSession(session, 'user-456')).toBe(false);
    });

    it('should check if session can be joined', () => {
      const sessionResult = createWorkoutSession({
        ...validParams,
        isMultiplayer: true,
      });
      if (sessionResult.isFailure) throw new Error('Failed to create session');
      let session = sessionResult.value;

      session = startSession(session, 'John Doe').value;
      expect(canJoin(session)).toBe(true);

      session = abandonSession(session).value;
      expect(canJoin(session)).toBe(false);
    });
  });
});
