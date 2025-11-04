import { Result } from '@bene/core/shared';
import { IAuthRepository } from '../../ports/auth.repository.js';
import { isValidEmail } from '@bene/utils/validate';
import { AuthError } from '../../errors/index.js';

export interface LoginInput {
  email: string;
  password: string;
  next?: string;
}

export interface LoginOutput {
  userId: string;
  email: string;
}

/**
 * Authenticates a user with email and password.
 * Returns user information on success.
 *
 * @example
 * const useCase = new LoginUseCase(authRepository);
 * const result = await useCase.execute({ email: 'user@example.com', password: 'password' });
 * if (result.isSuccess) {
 *   console.log(result.value);
 * }
 */
export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<Result<LoginOutput>> {
    // 1. Validate input
    const validationResult = this.validateInput(input);
    if (validationResult.isFailure) {
      return Result.fail(validationResult.error);
    }

    // 2. Execute login via repository
    const loginResult = await this.authRepository.login(input);

    return loginResult;
  }

  private validateInput(input: LoginInput): Result<void> {
    if (!input.email || !input.password) {
      return Result.fail(new AuthError('Email and password are required'));
    }

    if (!isValidEmail(input.email)) {
      return Result.fail(new AuthError('Invalid email format'));
    }

    return Result.ok();
  }
}
