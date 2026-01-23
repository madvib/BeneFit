import { describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';

import {
  CreateUserMessageSchema,
  CreateCoachMessageSchema,
  CreateSystemMessageSchema,
} from '../coach-msg.factory.js';
import { createCoachMsgFixture } from './coach-msg.fixtures.js';

describe('CoachMsg', () => {
  describe('User Message Factory', () => {
    it('should create a valid user message', () => {
      // Arrange
      const checkInId = randomUUID();
      const input = { content: 'Hello coach', checkInId };

      // Act
      const result = CreateUserMessageSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const message = result.data;
        expect(message.role).toBe('user');
        expect(message.content).toBe('Hello coach');
        expect(message.checkInId).toBe(checkInId);
        expect(message.timestamp).toBeInstanceOf(Date);
      }
    });

    it('should fail if content is empty', () => {
      const result = CreateUserMessageSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should fail if content is too long', () => {
      const longContent = 'a'.repeat(2001);
      const result = CreateUserMessageSchema.safeParse({ content: longContent });
      expect(result.success).toBe(false);
    });
  });

  describe('Coach Message Factory', () => {
    it('should create a valid coach message', () => {
      // Arrange
      const checkInId = randomUUID();
      const input = {
        content: 'Hello user',
        checkInId,
        tokens: 100
      };

      // Act
      const result = CreateCoachMessageSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const message = result.data;
        expect(message.role).toBe('coach');
        expect(message.content).toBe('Hello user');
        expect(message.checkInId).toBe(checkInId);
        expect(message.tokens).toBe(100);
        expect(message.timestamp).toBeInstanceOf(Date);
      }
    });

    it('should fail if tokens is negative', () => {
      const result = CreateCoachMessageSchema.safeParse({ content: 'Hello', tokens: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe('System Message Factory', () => {
    it('should create a valid system message', () => {
      // Act
      const result = CreateSystemMessageSchema.safeParse({ content: 'System update' });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const message = result.data;
        expect(message.role).toBe('system');
        expect(message.content).toBe('System update');
        expect(message.timestamp).toBeInstanceOf(Date);
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createCoachMsgFixture();

      expect(fixture.id).toBeDefined();
      expect(fixture.role).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const fixture = createCoachMsgFixture({ role: 'coach', content: 'Custom coach msg' });

      expect(fixture.role).toBe('coach');
      expect(fixture.content).toBe('Custom coach msg');
    });
  });
});
