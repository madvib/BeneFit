import { describe, it, expect } from 'vitest';
import { createSessionParticipant } from '../session-participant.factory.js';

describe('SessionParticipant', () => {
  describe('createSessionParticipant', () => {
    it('should create a valid participant', () => {
      const result = createSessionParticipant({
        userId: 'user-123',
        userName: 'John Doe',
        role: 'participant',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.userId).toBe('user-123');
        expect(result.value.userName).toBe('John Doe');
        expect(result.value.role).toBe('participant');
        expect(result.value.status).toBe('active');
        expect(result.value.joinedAt).toBeDefined();
        expect(result.value.completedActivities).toBe(0);
      }
    });

    it('should fail if required properties are missing', () => {
      const result = createSessionParticipant({
        userId: '',
        userName: 'John Doe',
        role: 'participant',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should create a spectator', () => {
      const result = createSessionParticipant({
        userId: 'user-456',
        userName: 'Jane Doe',
        role: 'spectator',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.role).toBe('spectator');
      }
    });

    it('should create with avatar', () => {
      const result = createSessionParticipant({
        userId: 'user-123',
        userName: 'John Doe',
        role: 'participant',
        avatar: 'http://example.com/avatar.jpg',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.avatar).toBe('http://example.com/avatar.jpg');
      }
    });
  });
});
