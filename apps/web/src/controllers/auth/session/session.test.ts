import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentUser,
  getSession,
  SessionResult,
  CurrentUserResult
} from './session';

// Mock the repositories that use Cloudflare context to avoid runtime errors in tests
vi.mock('@/providers/repositories', () => ({
  authUserRepository: {},
  authService: {},
}));

// Mock the auth use cases
vi.mock('@/providers/auth-use-cases', () => ({
  authUseCases: {
    getCurrentUserUseCase: vi.fn(() => Promise.resolve({
      execute: vi.fn().mockResolvedValue({
        isSuccess: true,
        value: {
          id: 'user-1',
          email: 'john.doe@example.com',
          name: 'John Doe'
        }
      })
    })),
    getCurrentSessionUseCase: vi.fn(() => Promise.resolve({
      execute: vi.fn().mockResolvedValue({
        isSuccess: true,
        value: {
          user: {
            id: 'user-1',
            email: 'john.doe@example.com',
            name: 'John Doe'
          },
          isAuthenticated: true
        }
      })
    }))
  }
}));

// Mock the Next.js server functions
vi.mock('next/headers', () => ({
  headers: () => new Headers(),
  cookies: () => ({
    getAll: () => [],
  }),
}));

// Mock the authUseCases
vi.mock('@/providers/auth-use-cases', () => ({
  authUseCases: {
    getCurrentUserUseCase: () => Promise.resolve({
      execute: vi.fn().mockResolvedValue({
        isSuccess: true,
        value: {
          id: 'user-1',
          email: 'john.doe@example.com',
          name: 'John Doe'
        }
      })
    }),
    getCurrentSessionUseCase: () => Promise.resolve({
      execute: vi.fn().mockResolvedValue({
        isSuccess: true,
        value: {
          user: {
            id: 'user-1',
            email: 'john.doe@example.com',
            name: 'John Doe'
          },
          isAuthenticated: true
        }
      })
    })
  }
}));

describe('Session Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('returns mock user data successfully', async () => {
      const result: CurrentUserResult = await getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.id).toBe('user-1');
        expect(result.data.email).toBe('john.doe@example.com');
      }
    });

    it('includes valid user ID in the response', async () => {
      const result: CurrentUserResult = await getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        // The ID should be a valid ID that exists in our mock data
        expect(typeof result.data.id).toBe('string');
        expect(result.data.id).toMatch(/^user-[123]/); // Should match one of our mock user IDs
      }
    });

    it('includes valid email in the response', async () => {
      const result: CurrentUserResult = await getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(typeof result.data.email).toBe('string');
        expect(result.data.email).toMatch(/.+@.+\..+/); // Basic email validation
      }
    });

    it('handles unexpected errors gracefully', async () => {
      // Get the mocked module and modify its behavior for this test
      const importedAuthUseCases = await import('@/providers/auth-use-cases');

      // Mock the use case to return an error
      importedAuthUseCases.authUseCases.getCurrentUserUseCase.mockResolvedValueOnce({
        execute: vi.fn().mockResolvedValue({
          isSuccess: false,
          error: new Error('Failed to get current user')
        })
      });

      const result: CurrentUserResult = await getCurrentUser();

      // Ensure error case is handled
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('consistently returns the same user data across multiple calls', async () => {
      const result1: CurrentUserResult = await getCurrentUser();
      const result2: CurrentUserResult = await getCurrentUser();

      expect(result1).toEqual(result2);
    });
  });

  describe('getSession', () => {
    it('returns mock session data successfully', async () => {
      const result: SessionResult = await getSession();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.isAuthenticated).toBe(true);
        expect(result.data.user).toBeDefined();
        if (result.data.user) {
          expect(result.data.user.id).toBe('user-1');
          expect(result.data.user.email).toBe('john.doe@example.com');
          expect(result.data.user.name).toBe('John Doe');
        }
      }
    });

    it('includes authenticated status in session data', async () => {
      const result: SessionResult = await getSession();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.isAuthenticated).toBe(true);
      }
    });

    it('includes user data in session when user is authenticated', async () => {
      const result: SessionResult = await getSession();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data && result.data.user) {
        expect(result.data.user.id).toBeDefined();
        expect(result.data.user.email).toBeDefined();
        expect(result.data.user.name).toBeDefined();
      }
    });

    it('handles unexpected errors gracefully', async () => {
      // Get the mocked module and modify its behavior for this test
      const importedAuthUseCases = await import('@/providers/auth-use-cases');

      // Mock the use case to return an error
      importedAuthUseCases.authUseCases.getCurrentSessionUseCase.mockResolvedValueOnce({
        execute: vi.fn().mockResolvedValue({
          isSuccess: false,
          error: new Error('Failed to get session')
        })
      });

      const result: SessionResult = await getSession();

      // Ensure error case is handled
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('maintains consistency between getCurrentUser and getSession user data', async () => {
      const currentUserResult = await getCurrentUser();
      const sessionResult = await getSession();

      expect(currentUserResult.success).toBe(true);
      expect(sessionResult.success).toBe(true);
      expect(sessionResult.data).toBeDefined();

      if (currentUserResult.success && sessionResult.success && sessionResult.data) {
        const currentUser = currentUserResult.data;
        const sessionUser = sessionResult.data.user;

        if (currentUser && sessionUser) {
          expect(currentUser.id).toBe(sessionUser.id);
          expect(currentUser.email).toBe(sessionUser.email);
        }
      }
    });

    it('returns null user when session is not authenticated (mock implementation)', async () => {
      // Mock a scenario where there's no authenticated user
      const importedAuthUseCases = await import('@/providers/auth-use-cases');

      importedAuthUseCases.authUseCases.getCurrentSessionUseCase.mockResolvedValueOnce({
        execute: vi.fn().mockResolvedValue({
          isSuccess: true,
          value: {
            user: null,
            isAuthenticated: false
          }
        })
      });

      const result: SessionResult = await getSession();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.user).toBeNull();
        expect(result.data.isAuthenticated).toBe(false);
      }
    });
  });

  describe('Integration between getCurrentUser and getSession', () => {
    it('both functions return consistent user information', async () => {
      const currentUserResult = await getCurrentUser();
      const sessionResult = await getSession();

      expect(currentUserResult.success).toBe(true);
      expect(sessionResult.success).toBe(true);

      if (currentUserResult.success && sessionResult.success && sessionResult.data) {
        const currentUser = currentUserResult.data;
        const sessionUser = sessionResult.data.user;

        if (currentUser && sessionUser) {
          // Verify that both functions return the same user ID and email
          expect(currentUser.id).toBe(sessionUser.id);
          expect(currentUser.email).toBe(sessionUser.email);
        }
      }
    });

    it('session authentication status matches user availability', async () => {
      const sessionResult = await getSession();

      expect(sessionResult.success).toBe(true);
      if (sessionResult.success && sessionResult.data) {
        // In our mock implementation, user always exists and is authenticated
        expect(sessionResult.data.isAuthenticated).toBe(true);
        expect(sessionResult.data.user).not.toBeNull();
      }
    });
  });

  describe('Error handling edge cases', () => {
    it('provides consistent response structure', async () => {
      const currentUserResult = await getCurrentUser();
      const sessionResult = await getSession();

      // Verify response structure
      expect(currentUserResult).toHaveProperty('success');
      expect(currentUserResult).toHaveProperty('data');

      expect(sessionResult).toHaveProperty('success');
      expect(sessionResult).toHaveProperty('data');
    });
  });
});
