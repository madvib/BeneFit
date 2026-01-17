import { describe, it, expect } from 'vitest';
import { createDefaultSessionConfig } from '../session-configuration.factory.js';

describe('SessionConfiguration', () => {
  describe('createDefaultSessionConfig', () => {
    it('should create correct defaults for single player', () => {
      const config = createDefaultSessionConfig(false);

      expect(config.isMultiplayer).toBe(false);
      expect(config.maxParticipants).toBe(1);
      expect(config.enableChat).toBe(false);
      expect(config.showOtherParticipantsProgress).toBe(false);
      expect(config.isPublic).toBe(false);
      expect(config.enableVoiceAnnouncements).toBe(true);
    });

    it('should create correct defaults for multiplayer', () => {
      const config = createDefaultSessionConfig(true);

      expect(config.isMultiplayer).toBe(true);
      expect(config.maxParticipants).toBe(10);
      expect(config.enableChat).toBe(true);
      expect(config.showOtherParticipantsProgress).toBe(true);
      expect(config.isPublic).toBe(false);
      expect(config.enableVoiceAnnouncements).toBe(true);
    });
  });
});
