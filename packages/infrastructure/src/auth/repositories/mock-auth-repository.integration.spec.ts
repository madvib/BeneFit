import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MockAuthRepository } from './mock-auth-repository.js';
import { User } from '@bene/core/auth';

describe('MockAuthRepository (Integration)', () => {
  let repository: MockAuthRepository;

  beforeAll(async () => {
    repository = new MockAuthRepository();
  });

  afterAll(async () => {});

  beforeEach(async () => {
    // Clean database
  });

  it('should save and retrieve auth', async () => {
    // Create entity
    const authResult = User.create({
      id: 'test-123',
      email: 'test@example.com',
    });
    
    expect(authResult.isSuccess).toBe(true);
    const auth = authResult.value;

    // Save
    const saveResult = await repository.save(auth);
    expect(saveResult.isSuccess).toBe(true);

    // Retrieve
    const findResult = await repository.findById('test-123');
    expect(findResult.isSuccess).toBe(true);
    if (findResult.isSuccess) {
      expect(findResult.value.id).toBe('test-123');
    }
  });

  it('should return error when not found', async () => {
    const result = await repository.findById('nonexistent');

    expect(result.isFailure).toBe(true);
    expect(result.error.message).toContain('not found');
  });
});
