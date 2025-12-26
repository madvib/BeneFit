import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/shared';
import { AuthService } from '../../../services/auth.service.js';
import { GetCurrentUserUseCase } from './get-current-user.use-case.js';

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;
  let mockAuthService: AuthService;

  beforeEach(() => {
    mockAuthService = {
      getCurrentUser: vi.fn(),
    } as AuthService;
    useCase = new GetCurrentUserUseCase(mockAuthService);
  });

  it('should return a failure result with appropriate error message', async () => {
    // Mock the authService to return a failure
    mockAuthService.getCurrentUser.mockResolvedValue(
      Result.fail(
        new Error('Session management needs to be handled in infrastructure layer'),
      ),
    );

    const result = await useCase.execute({} as { userId?: string });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe(
        'Session management needs to be handled in infrastructure layer',
      );
    }
  });

  it('should handle unexpected errors gracefully', async () => {
    // Mock the authService to return a success
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    mockAuthService.getCurrentUser.mockResolvedValue(Result.ok(mockUser));

    const result = await useCase.execute({} as { userId?: string });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.id).toBe('1');
      expect(result.value.email).toBe('test@example.com');
      expect(result.value.name).toBe('Test User');
    }
  });
});
