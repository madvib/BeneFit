import { Result } from '@bene/core/shared';
import { IAuthService } from '../../ports/auth.service.js';
import { isValidEmail } from '@bene/utils/validate';
import { AuthError } from '../../errors/index.js';

export interface ResetPasswordInput {
  email: string;
}

/**
 * Initiates password reset for a user.
 * Sends a password reset email.
 *
 * @example
 * const useCase = new ResetPasswordUseCase(authRepository);
 * const result = await useCase.execute({ email: 'user@example.com' });
 * if (result.isSuccess) {
 *   console.log('Password reset email sent');
 * }
 */
export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthService) {}

  async execute(input: ResetPasswordInput): Promise<Result<void>> {
    // 1. Validate input
    const validationResult = this.validateInput(input);
    if (validationResult.isFailure) {
      return Result.fail(validationResult.error);
    }

    // 2. Execute password reset via repository
    const resetResult = await this.authRepository.resetPassword(input);

    return resetResult;
  }

  private validateInput(input: ResetPasswordInput): Result<void> {
    if (!input.email) {
      return Result.fail(new AuthError('Email is required'));
    }

    if (!isValidEmail(input.email)) {
      return Result.fail(new AuthError('Invalid email format'));
    }

    return Result.ok();
  }
}
