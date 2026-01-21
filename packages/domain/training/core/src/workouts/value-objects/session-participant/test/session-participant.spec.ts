import { describe, it, expect } from 'vitest';
import { CreateSessionParticipantSchema } from '../session-participant.factory.js';
import { createActiveParticipantFixture, createSpectatorParticipantFixture } from './session-participant.fixtures.js';

describe('SessionParticipant', () => {
  describe('creation', () => {
    it('should create a valid participant with fixture', () => {
      // Arrange & Act
      const participant = createActiveParticipantFixture({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        userName: 'John Doe',
        role: 'participant',
      });

      // Assert
      expect(participant.userId).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(participant.userName).toBe('John Doe');
      expect(participant.role).toBe('participant');
      expect(participant.status).toBe('active');
      expect(participant.joinedAt).toBeDefined();
      expect(participant.completedActivities).toBeGreaterThanOrEqual(0);
    });

    it('should create a spectator', () => {
      // Arrange & Act
      const spectator = createSpectatorParticipantFixture({
        userId: '550e8400-e29b-41d4-a716-446655440001',
        userName: 'Jane Doe',
      });

      // Assert
      expect(spectator.role).toBe('spectator');
      expect(spectator.status).toBe('active');
    });

    it('should create with avatar', () => {
      // Arrange & Act
      const participant = createActiveParticipantFixture({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        userName: 'John Doe',
        avatar: 'http://example.com/avatar.jpg',
      });

      // Assert
      expect(participant.avatar).toBe('http://example.com/avatar.jpg');
    });
  });

  describe('validation', () => {
    it('should fail if required properties are missing', () => {
      // Arrange
      const invalidInput = {
        userId: '',
        userName: 'John Doe',
        role: 'participant' as const,
      };

      // Act
      const parseResult = CreateSessionParticipantSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });
});
