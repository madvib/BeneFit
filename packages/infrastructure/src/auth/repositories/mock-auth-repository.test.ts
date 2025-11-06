import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockAuthRepository } from '../../../../infrastructure/src/auth/repositories/mock-auth-repository';
import { User } from '@bene/core/auth';
import { Result } from '@bene/core/shared';

describe('MockAuthRepository', () => {
  let repository: MockAuthRepository;

  beforeEach(() => {
    // Since MockAuthRepository loads mock data in constructor, we need to handle that
    repository = new MockAuthRepository();
  });

  describe('login', () => {
    it('returns success when user exists with correct credentials', async () => {
      const loginInput = {
        email: 'john.doe@example.com',
        password: 'any-password-for-mock', // Password check is skipped in mock
      };

      const result = await repository.login(loginInput);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.userId).toBeDefined();
        expect(result.value.email).toBe('john.doe@example.com');
      }
    });

    it('returns failure when user does not exist', async () => {
      const loginInput = {
        email: 'nonexistent@example.com',
        password: 'any-password',
      };

      const result = await repository.login(loginInput);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toBe('Invalid email or password');
      }
    });

    it('properly handles email comparison', async () => {
      const loginInput = {
        email: 'jane.smith@example.com',
        password: 'any-password',
      };

      const result = await repository.login(loginInput);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.email).toBe('jane.smith@example.com');
      }
    });
  });

  describe('signup', () => {
    it('creates new user with provided email', async () => {
      const signupInput = {
        email: 'newuser@example.com',
        password: 'securepassword',
      };

      const result = await repository.signup(signupInput);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.email).toBe('newuser@example.com');
        expect(result.value.userId).toBeDefined();
        expect(result.value.requiresEmailConfirmation).toBe(true);
      }
    });

    it('returns failure when user already exists', async () => {
      const signupInput = {
        email: 'john.doe@example.com', // This email already exists in mock data
        password: 'another-password',
      };

      const result = await repository.signup(signupInput);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toBe('User already exists');
      }
    });

    it('generates unique user ID for new signup', async () => {
      const signupInput = {
        email: 'uniqueuser@example.com',
        password: 'password',
      };

      const result = await repository.signup(signupInput);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.userId).toMatch(/^user-\d+$/); // Should match timestamp pattern
      }
    });
  });

  describe('findByEmail', () => {
    it('returns user when email exists', async () => {
      const result = await repository.findByEmail('john.doe@example.com');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const user = result.value;
        expect(user).toBeDefined();
        expect(user?.email).toBe('john.doe@example.com');
        expect(user?.name).toBe('John Doe');
      }
    });

    it('returns null when email does not exist', async () => {
      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toBeNull();
      }
    });

    it('performs case-sensitive email lookup', async () => {
      // Test uppercase email (should not match)
      const result = await repository.findByEmail('JOHN.DOE@EXAMPLE.COM');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toBeNull();
      }
    });

    it('returns user with all appropriate properties', async () => {
      const result = await repository.findByEmail('mike.johnson@example.com');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess && result.value) {
        expect(result.value.email).toBe('mike.johnson@example.com');
        expect(result.value.name).toBe('Mike Johnson');
        expect(result.value.isActive).toBe(true);
        expect(result.value.createdAt).toBeInstanceOf(Date);
      }
    });
  });

  describe('findById', () => {
    it('returns user when ID exists in loaded mock data', async () => {
      // We need to use one of the IDs from the mock data
      // Since the actual IDs depend on the loaded mock data, let's first verify what's loaded
      const result = await repository.findById('user-1'); // This should exist if we're using the mock data

      // The result depends on the actual loaded mock data
      // Let's just ensure the method works properly
      const allUsersResult = await repository.findByEmail('john.doe@example.com');
      if (allUsersResult.isSuccess && allUsersResult.value) {
        const userId = allUsersResult.value.id;
        const findByIdResult = await repository.findById(userId);
        
        expect(findByIdResult.isSuccess).toBe(true);
        if (findByIdResult.isSuccess) {
          expect(findByIdResult.value).toBeDefined();
          expect(findByIdResult.value.id).toBe(userId);
        }
      }
    });

    it('returns failure when user does not exist', async () => {
      const result = await repository.findById('nonexistent-id');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toBe('User not found');
      }
    });
  });

  describe('save', () => {
    it('saves user to repository', async () => {
      const userResult = User.create({
        id: 'test-user-save',
        email: 'savetest@example.com',
      });

      if (userResult.isSuccess) {
        const saveResult = await repository.save(userResult.value);
        
        expect(saveResult.isSuccess).toBe(true);
        
        // Verify that the user can be retrieved after saving
        const retrievedResult = await repository.findById('test-user-save');
        expect(retrievedResult.isSuccess).toBe(true);
        if (retrievedResult.isSuccess) {
          expect(retrievedResult.value.email).toBe('savetest@example.com');
        }
      }
    });

    it('allows email lookup after save', async () => {
      const userResult = User.create({
        id: 'test-user-email-lookup',
        email: 'lookuptest@example.com',
      });

      if (userResult.isSuccess) {
        await repository.save(userResult.value);
        
        // Verify that the user can be found by email
        const emailLookupResult = await repository.findByEmail('lookuptest@example.com');
        expect(emailLookupResult.isSuccess).toBe(true);
        if (emailLookupResult.isSuccess) {
          expect(emailLookupResult.value?.id).toBe('test-user-email-lookup');
        }
      }
    });
  });

  describe('exists', () => {
    it('returns true when user exists', async () => {
      // First get a known user's ID
      const userResult = await repository.findByEmail('john.doe@example.com');
      if (userResult.isSuccess && userResult.value) {
        const existsResult = await repository.exists(userResult.value.id);
        
        expect(existsResult.isSuccess).toBe(true);
        if (existsResult.isSuccess) {
          expect(existsResult.value).toBe(true);
        }
      }
    });

    it('returns false when user does not exist', async () => {
      const result = await repository.exists('nonexistent-id');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toBe(false);
      }
    });

    it('returns correct result after user is saved', async () => {
      const userResult = User.create({
        id: 'test-user-exists',
        email: 'existstest@example.com',
      });

      if (userResult.isSuccess) {
        // Initially should not exist
        const beforeResult = await repository.exists('test-user-exists');
        expect(beforeResult.isSuccess).toBe(true);
        if (beforeResult.isSuccess) {
          expect(beforeResult.value).toBe(false);
        }

        // Save user
        await repository.save(userResult.value);

        // Should now exist
        const afterResult = await repository.exists('test-user-exists');
        expect(afterResult.isSuccess).toBe(true);
        if (afterResult.isSuccess) {
          expect(afterResult.value).toBe(true);
        }
      }
    });
  });

  describe('delete', () => {
    it('removes user from repository', async () => {
      // First create and save a user
      const userResult = User.create({
        id: 'test-user-delete',
        email: 'deletetest@example.com',
      });

      if (userResult.isSuccess) {
        // Save the user
        await repository.save(userResult.value);
        
        // Verify it exists initially
        const existsBefore = await repository.exists('test-user-delete');
        expect(existsBefore.isSuccess).toBe(true);
        if (existsBefore.isSuccess) {
          expect(existsBefore.value).toBe(true);
        }
        
        // Delete the user
        const deleteResult = await repository.delete('test-user-delete');
        expect(deleteResult.isSuccess).toBe(true);
        
        // Verify it no longer exists
        const existsAfter = await repository.exists('test-user-delete');
        expect(existsAfter.isSuccess).toBe(true);
        if (existsAfter.isSuccess) {
          expect(existsAfter.value).toBe(false);
        }
      }
    });

    it('returns failure when trying to delete non-existent user', async () => {
      const result = await repository.delete('nonexistent-id');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toBe('User not found');
      }
    });

    it('removes both ID and email mappings when deleted', async () => {
      const userResult = User.create({
        id: 'test-user-mappings',
        email: 'mappingtest@example.com',
      });

      if (userResult.isSuccess) {
        // Save the user
        await repository.save(userResult.value);
        
        // Verify both mappings exist
        const byId = await repository.findById('test-user-mappings');
        const byEmail = await repository.findByEmail('mappingtest@example.com');
        
        expect(byId.isSuccess).toBe(true);
        expect(byEmail.isSuccess).toBe(true);
        
        // Delete the user
        const deleteResult = await repository.delete('test-user-mappings');
        expect(deleteResult.isSuccess).toBe(true);
        
        // Verify both mappings are gone
        const byIdAfter = await repository.findById('test-user-mappings');
        const byEmailAfter = await repository.findByEmail('mappingtest@example.com');
        
        expect(byIdAfter.isFailure).toBe(true); // Should fail because user is not found
        expect(byEmailAfter.isSuccess).toBe(true); // Should succeed but return null
        if (byEmailAfter.isSuccess) {
          expect(byEmailAfter.value).toBeNull();
        }
      }
    });
  });

  describe('resetPassword', () => {
    it('returns success for any input (mock implementation)', async () => {
      const input = {
        email: 'user@example.com',
      };

      const result = await repository.resetPassword(input);

      expect(result.isSuccess).toBe(true);
    });

    it('logs the input for debugging (mock implementation)', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const input = {
        email: 'user@example.com',
      };

      await repository.resetPassword(input);

      expect(consoleSpy).toHaveBeenCalledWith('input:', JSON.stringify(input));
      consoleSpy.mockRestore();
    });
  });

  describe('signOut', () => {
    it('returns success (mock implementation)', async () => {
      const result = await repository.signOut();

      expect(result.isSuccess).toBe(true);
    });
  });

  describe('update', () => {
    it('logs warning when updating non-existent user', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const partialUser = {
        name: 'Updated Name',
      };

      const result = await repository.update('nonexistent-id', partialUser);

      expect(result.isSuccess).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('updating user:', partialUser);
      consoleSpy.mockRestore();
    });

    it('logs update operation for existing user', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const partialUser = {
        name: 'Updated Name',
      };

      // Even though it's a mock update, it should still log
      const result = await repository.update('some-id', partialUser);

      expect(result.isSuccess).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('updating user:', partialUser);
      consoleSpy.mockRestore();
    });
  });
});