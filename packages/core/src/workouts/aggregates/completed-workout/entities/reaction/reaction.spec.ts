import { describe, it, expect } from 'vitest';
import { createReaction } from './reaction.factory.js';

describe('Reaction', () => {
  describe('createReaction', () => {
    it('should create a valid reaction', () => {
      const result = createReaction({
        userId: 'user-123',
        userName: 'John Doe',
        type: 'fire',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.userId).toBe('user-123');
        expect(result.value.userName).toBe('John Doe');
        expect(result.value.type).toBe('fire');
        expect(result.value.id).toBeDefined();
        expect(result.value.createdAt).toBeDefined();
      }
    });

    it('should fail if userId is empty', () => {
      const result = createReaction({
        userId: '',
        userName: 'John Doe',
        type: 'fire',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if userName is empty', () => {
      const result = createReaction({
        userId: 'user-123',
        userName: '',
        type: 'fire',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should create reactions with different types', () => {
      const types = ['fire', 'strong', 'clap', 'heart', 'smile'] as const;

      types.forEach((type) => {
        const result = createReaction({
          userId: 'user-123',
          userName: 'John Doe',
          type,
        });

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(result.value.type).toBe(type);
        }
      });
    });
  });
});