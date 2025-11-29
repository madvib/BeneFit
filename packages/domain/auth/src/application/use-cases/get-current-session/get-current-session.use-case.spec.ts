import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/domain-shared';
import { GetCurrentSessionUseCase } from './get-current-session.use-case.js';

describe('GetCurrentSessionUseCase', () => {
  let useCase: GetCurrentSessionUseCase;
  let mockAuthService: any;

  beforeEach(() => {
    mockAuthService = {
      getSession: vi.fn(),
      getCurrentUser: vi.fn(),
    };
    useCase = new GetCurrentSessionUseCase(mockAuthService);
  });

  it('should return a successful result when executing', async () => {
    // Mock the authService to return a valid session
    mockAuthService.getSession.mockResolvedValue(
      Result.ok({ id: '1', email: 'test@example.com' }),
    );
    mockAuthService.getCurrentUser.mockResolvedValue(
      Result.ok({ id: '1', email: 'test@example.com', name: 'Test User' }),
    );

    const result = await useCase.execute({} as any);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toBeDefined();
      expect(result.value.isAuthenticated).toBe(true);
      expect(result.value.user).toBeDefined();
    }
  });

  it('should return the correct output structure', async () => {
    // Mock the authService to return a valid session
    mockAuthService.getSession.mockResolvedValue(
      Result.ok({ id: '1', email: 'test@example.com' }),
    );
    mockAuthService.getCurrentUser.mockResolvedValue(
      Result.ok({ id: '1', email: 'test@example.com', name: 'Test User' }),
    );

    const result = await useCase.execute({} as any);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const output = result.value;
      expect(output).toHaveProperty('user');
      expect(output).toHaveProperty('isAuthenticated');
      // expiresAt is optional, so we don't expect it to always be present
      expect(output.isAuthenticated).toBe(true);
      expect(output.user).toBeDefined();
    }
  });

  it('should handle potential errors gracefully', async () => {
    // Mock the authService to return no session
    mockAuthService.getSession.mockResolvedValue(Result.ok(null));

    const result = await useCase.execute({} as any);

    // Should return success result with no user and not authenticated
    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    if (result.isSuccess) {
      expect(result.value.isAuthenticated).toBe(false);
      expect(result.value.user).toBe(null);
    }
  });
});
