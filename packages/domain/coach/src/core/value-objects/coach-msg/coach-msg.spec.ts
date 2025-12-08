import { describe, it, expect } from 'vitest';
import {
  createUserMessage,
  createCoachMessage,
  createSystemMessage,
} from './coach-msg.factory.js';

describe('CoachMsg Value Object', () => {
  describe('createUserMessage', () => {
    it('should create a valid user message', () => {
      const result = createUserMessage('Hello coach', 'check-in-123');

      expect(result.isSuccess).toBe(true);
      const message = result.value;
      expect(message.role).toBe('user');
      expect(message.content).toBe('Hello coach');
      expect(message.checkInId).toBe('check-in-123');
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should fail if content is empty', () => {
      const result = createUserMessage('');
      expect(result.isFailure).toBe(true);
    });

    it('should fail if content is too long', () => {
      const longContent = 'a'.repeat(2001);
      const result = createUserMessage(longContent);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('createCoachMessage', () => {
    it('should create a valid coach message', () => {
      const result = createCoachMessage('Hello user', [], 'check-in-123', 100);

      expect(result.isSuccess).toBe(true);
      const message = result.value;
      expect(message.role).toBe('coach');
      expect(message.content).toBe('Hello user');
      expect(message.checkInId).toBe('check-in-123');
      expect(message.tokens).toBe(100);
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should fail if content is empty', () => {
      const result = createCoachMessage('');
      expect(result.isFailure).toBe(true);
    });

    it('should fail if content is too long', () => {
      const longContent = 'a'.repeat(2001);
      const result = createCoachMessage(longContent);
      expect(result.isFailure).toBe(true);
    });

    it('should fail if tokens is negative', () => {
      const result = createCoachMessage('Hello', [], undefined, -1);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('createSystemMessage', () => {
    it('should create a valid system message', () => {
      const result = createSystemMessage('System update');

      expect(result.isSuccess).toBe(true);
      const message = result.value;
      expect(message.role).toBe('system');
      expect(message.content).toBe('System update');
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should fail if content is empty', () => {
      const result = createSystemMessage('');
      expect(result.isFailure).toBe(true);
    });
  });
});
