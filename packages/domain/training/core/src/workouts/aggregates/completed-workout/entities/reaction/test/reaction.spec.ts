import { describe, it, expect } from 'vitest';
import { CreateReactionSchema } from '../reaction.factory.js';
import { createReactionInputFixture, createReactionFixture } from './reaction.fixtures.js';

describe('Reaction', () => {
  describe('Factory', () => {
    it('should create a valid reaction', () => {
      const input = createReactionInputFixture();

      const result = CreateReactionSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userId).toBe(input.userId);
        expect(result.data.userName).toBe(input.userName);
        expect(result.data.type).toBe(input.type);
        expect(result.data.id).toBeDefined();
        expect(result.data.createdAt).toBeDefined();
      }
    });

    it('should fail if userId is invalid', () => {
      const input = createReactionInputFixture({ userId: 'invalid-uuid' });

      const result = CreateReactionSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should fail if userName is empty', () => {
      const input = createReactionInputFixture({ userName: '' });

      const result = CreateReactionSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const reaction = createReactionFixture();
      expect(reaction.id).toBeDefined();
      expect(reaction.type).toBeDefined();
    });

    it('should allow fixture overrides', () => {
      const reaction = createReactionFixture({ type: 'clap' });
      expect(reaction.type).toBe('clap');
    });
  });
});
