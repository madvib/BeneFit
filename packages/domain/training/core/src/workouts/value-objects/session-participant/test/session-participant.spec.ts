import { describe, it, expect } from 'vitest';

import { CreateSessionParticipantSchema } from '../session-participant.factory.js';
import { createActiveParticipantFixture, createSpectatorParticipantFixture } from '@/fixtures.js';

describe('SessionParticipant', () => {
  describe('creation', () => {
    it('should create a valid participant with fixture', () => {
      // Arrange & Act
      const userId = crypto.randomUUID();
      const userName = 'Test Participant';
      const participant = createActiveParticipantFixture({
        userId,
        userName,
        role: 'participant',
      });

      // Assert
      expect(participant.userId).toBe(userId);
      expect(participant.userName).toBe(userName);
      expect(participant.role).toBe('participant');
      expect(participant.status).toBe('active');
      expect(participant.joinedAt).toBeDefined();
      expect(participant.completedActivities).toBeGreaterThanOrEqual(0);
    });

    it('should create a spectator', () => {
      // Arrange & Act
      const userId = crypto.randomUUID();
      const userName = 'Test Spectator';
      const spectator = createSpectatorParticipantFixture({
        userId,
        userName,
      });

      // Assert
      expect(spectator.role).toBe('spectator');
      expect(spectator.status).toBe('active');
      expect(spectator.userId).toBe(userId);
      expect(spectator.userName).toBe(userName);
    });

    it('should create with avatar', () => {
      // Arrange & Act
      const avatar = 'https://example.com/avatar.png';
      const participant = createActiveParticipantFixture({
        userId: crypto.randomUUID(),
        userName: 'Test Avatar User',
        avatar,
      });

      // Assert
      expect(participant.avatar).toBe(avatar);
    });
  });

  describe('validation', () => {
    it('should fail if required properties are missing', () => {
      // Arrange
      const invalidInput = {
        userId: '',
        userName: 'Test Invalid User',
        role: 'participant' as const,
      };

      // Act
      const parseResult = CreateSessionParticipantSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });
});
