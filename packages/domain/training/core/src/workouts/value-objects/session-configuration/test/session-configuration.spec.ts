
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { createSessionConfigurationFixture } from '@/fixtures.js';

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
      const maxParticipants = faker.number.int({ min: 2, max: 10 });
      const config = createSessionConfigurationFixture({
        isMultiplayer: true,
        isPublic: true,
        maxParticipants,
        enableChat: false,
      });

      // Assert
      expect(config.isPublic).toBe(true);
      expect(config.maxParticipants).toBe(maxParticipants);
      expect(config.enableChat).toBe(false);
    });
  });
});
