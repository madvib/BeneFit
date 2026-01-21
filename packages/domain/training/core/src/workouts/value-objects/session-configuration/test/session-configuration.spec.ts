import { describe, it, expect } from 'vitest';
import { createSessionConfigurationFixture } from './session-configuration.fixtures.js';

describe('SessionConfiguration', () => {
  describe('creation', () => {
    it('should create correct defaults for single player', () => {
      // Arrange & Act
      const config = createSessionConfigurationFixture({
        isMultiplayer: false,
      });

      // Assert
      expect(config.isMultiplayer).toBe(false);
      expect(config.maxParticipants).toBe(1);
    });

    it('should create correct defaults for multiplayer', () => {
      // Arrange & Act
      const config = createSessionConfigurationFixture({
        isMultiplayer: true,
      });

      // Assert
      expect(config.isMultiplayer).toBe(true);
      expect(config.maxParticipants).toBeGreaterThan(1);
    });

    it('should allow customization through overrides', () => {
      // Arrange & Act
      const config = createSessionConfigurationFixture({
        isMultiplayer: true,
        isPublic: true,
        maxParticipants: 5,
        enableChat: false,
      });

      // Assert
      expect(config.isPublic).toBe(true);
      expect(config.maxParticipants).toBe(5);
      expect(config.enableChat).toBe(false);
    });
  });
});
